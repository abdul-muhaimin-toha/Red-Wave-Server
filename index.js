require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: ['http://localhost:5173'],
  credentials: true,
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Unauthorized access' });
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized access' });
    }
    req.decoded = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5chsr9x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get('/', (req, res) => {
  res.send('Red Wave server is running!');
});

async function run() {
  try {
    const database = client.db('redWave');
    const districtsCollection = database.collection('districts');
    const upazilasCollection = database.collection('upazilas');
    const usersCollection = database.collection('users');
    const donationRequestsCollection = database.collection('donationRequests');
    const contentsCollection = database.collection('contents');

    // Auth Related API

    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.TOKEN_SECRET, {
        expiresIn: '1h',
      });
      res.send({ token });
    });

    // Users Data related API

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await usersCollection.findOne(filter);
      res.send(result);
    });

    app.get('/users/', async (req, res) => {
      const query = req.query;
      let filter = {};
      if (query.status) {
        filter.status = query.status;
      }
      const result = await usersCollection.find(filter).toArray();
      res.send(result);
    });

    app.put('/users', async (req, res) => {
      const user = req.body;

      const filter = { email: user?.email };

      const options = { upsert: true };

      const updateDoc = {
        $set: {
          ...user,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );

      res.send(result);
    });

    app.patch('/users', async (req, res) => {
      const user = req.body;

      const filter = { _id: new ObjectId(user._id) };

      const updateDoc = {
        $set: {
          status: user.status,
          role: user.role,
        },
      };

      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // Districts & Upazila Related API

    app.get('/districts', async (req, res) => {
      const result = await districtsCollection
        .find()
        .sort({ name: 1 })
        .toArray();
      res.send(result);
    });

    app.get('/upazilas', async (req, res) => {
      const result = await upazilasCollection
        .find()
        .sort({ name: 1 })
        .toArray();
      res.send(result);
    });

    // Donation Request Related API

    app.get('/donation-requests/:email', async (req, res) => {
      const email = req.params.email;
      const filter = {
        requester_email: email,
      };
      const result = await donationRequestsCollection.find(filter).toArray();
      res.send(result);
    });

    app.post('/donation-requests', async (req, res) => {
      const donationData = req.body;

      const result = await donationRequestsCollection.insertOne(donationData);
      res.send(result);
    });

    // BLog Content Related API

    app.post('/blogs', async (req, res) => {
      const blog = req.body;
      const result = await contentsCollection.insertOne(blog);
      res.send(result);
    });

    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Red Wave is running on port ${port}`);
});
