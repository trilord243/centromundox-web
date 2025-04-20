import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// URI para conectar a MongoDB
const uri = 'mongodb+srv://escalonaf12:Link420@cluster0.92puj.mongodb.net/test';

// Conectar al cliente de MongoDB
async function connectToDatabase() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  return { client, db };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const userId = searchParams.get('userId');
  const requestId = searchParams.get('requestId');

  try {
    const { db, client } = await connectToDatabase();

    let result;
    
    switch (action) {
      case 'getCurrentUser':
        if (!userId) {
          return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }
        result = await db.collection('users').findOne({ _id: new ObjectId(userId) });
        break;
        
      case 'getAllUsers':
        result = await db.collection('users').find({}).toArray();
        break;
        
      case 'getCabinetStatus':
        result = await db.collection('cabinet').findOne({});
        break;
        
      case 'getAllProducts':
        result = await db.collection('products').find({}).toArray();
        break;
        
      case 'getAllObjects':
        result = await db.collection('objects').find({}).toArray();
        break;
        
      case 'getLensRequests':
        result = await db.collection('lens_requests').find({}).toArray();
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    await client.close();
    return NextResponse.json(result);
  } catch (error) {
    console.error('MongoDB error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, data } = await request.json();
    const { db, client } = await connectToDatabase();
    
    let result;
    
    switch (action) {
      case 'approveLensRequest':
        if (!data.requestId) {
          return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
        }
        
        // Calculamos la fecha de expiración
        const expiresAt = new Date();
        const { days = 0, weeks = 0, months = 0 } = data.expiration || {};
        
        if (days) expiresAt.setDate(expiresAt.getDate() + days);
        if (weeks) expiresAt.setDate(expiresAt.getDate() + (weeks * 7));
        if (months) expiresAt.setMonth(expiresAt.getMonth() + months);
        
        // Actualizamos la solicitud
        await db.collection('lens_requests').updateOne(
          { _id: new ObjectId(data.requestId) },
          { 
            $set: { 
              status: 'approved',
              accessCode: data.accessCode,
              expiresAt,
              expiration: data.expiration,
              processedAt: new Date(),
              processedBy: data.processedBy
            } 
          }
        );
        
        // Obtenemos la solicitud actualizada
        const updatedRequest = await db.collection('lens_requests').findOne({ _id: new ObjectId(data.requestId) });
        
        // También actualizamos la fecha de expiración en el usuario
        if (updatedRequest && updatedRequest.userId) {
          await db.collection('users').updateOne(
            { _id: new ObjectId(updatedRequest.userId) },
            { $set: { accessCodeExpiresAt: expiresAt, codigo_acceso: data.accessCode } }
          );
        }
        
        result = updatedRequest;
        break;
        
      default:
        await client.close();
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    await client.close();
    return NextResponse.json(result);
  } catch (error) {
    console.error('MongoDB error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
} 