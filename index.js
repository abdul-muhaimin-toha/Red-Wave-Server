require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
const stripe = require('stripe')(process.env.STRIPE_SK);

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
    const fundsCollection = database.collection('funds');

    // Auth Related API

    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.TOKEN_SECRET, {
        expiresIn: '1h',
      });
      res.send({ token });
    });

    // Payment Related API

    app.post('/create-payment-intent', verifyToken, async (req, res) => {
      const amount = req.body.amount;
      const amountInCent = parseFloat(amount) * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCent,
        currency: 'usd',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.post('/funds', verifyToken, async (req, res) => {
      const document = req.body;

      const result = await fundsCollection.insertOne(document);
      res.send(result);
    });

    // Users Data related API

    app.get('/users/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await usersCollection.findOne(filter);
      res.send(result);
    });

    app.get('/users', verifyToken, async (req, res) => {
      const query = req.query;
      let filter = {};
      if (query.status) {
        filter.status = query.status;
      }
      const result = await usersCollection.find(filter).toArray();
      res.send(result);
    });

    app.get('/users-by-search', async (req, res) => {
      const bloodGroup = req.query.bloodGroup;
      const district = req.query.district;
      const upazila = req.query.upazila;
      let filter = {};
      if (bloodGroup || district || upazila) {
        filter = {
          bloodGroup: bloodGroup,
          district: district,
          upazila: upazila,
        };
      }
      const result = await usersCollection.find(filter).toArray();
      res.send(result);
    });

    app.put('/users', verifyToken, async (req, res) => {
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

    app.patch('/users', verifyToken, async (req, res) => {
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

    app.get('/donation-request-single/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      console.log('ffff');
      const filter = { _id: new ObjectId(id) };
      const result = await donationRequestsCollection.findOne(filter);
      res.send(result);
    });

    app.get('/pending-donation-requests', async (req, res) => {
      const result = await donationRequestsCollection
        .find({ donation_status: 'pending' })
        .toArray();
      res.send(result);
    });

    app.get('/donation-requests', verifyToken, async (req, res) => {
      const status = req.query.status;

      let filter = {};
      if (status) {
        filter = { donation_status: status };
      }

      const result = await donationRequestsCollection.find(filter).toArray();
      res.send(result);
    });

    app.get('/donation-requests/:email', verifyToken, async (req, res) => {
      const limit = +req.query.limit;
      const status = req.query.status;
      const email = req.params.email;
      let filter = {};
      if (status) {
        filter = {
          requester_email: email,
          donation_status: status,
        };
      } else {
        filter = {
          requester_email: email,
        };
      }

      const result = await donationRequestsCollection
        .find(filter)
        .limit(limit)
        .toArray();
      res.send(result);
    });

    app.post('/donation-requests', verifyToken, async (req, res) => {
      const donationData = req.body;

      const result = await donationRequestsCollection.insertOne(donationData);
      res.send(result);
    });

    app.put('/donation-request-single', verifyToken, async (req, res) => {
      const donationRequest = req.body;

      const filter = { requester_email: donationRequest?.requester_email };

      const updateDoc = {
        $set: {
          ...donationRequest,
        },
      };
      const result = await donationRequestsCollection.updateOne(
        filter,
        updateDoc
      );

      res.send(result);
    });

    app.patch('/blood-donation-apply', verifyToken, async (req, res) => {
      const newData = req.body;
      const filter = { _id: new ObjectId(newData.id) };

      const updateDoc = {
        $set: {
          donation_status: newData.donation_status,
          donor_name: newData.donor_name,
          donor_email: newData.donor_email,
        },
      };

      const result = await donationRequestsCollection.updateOne(
        filter,
        updateDoc
      );
      res.send(result);
    });

    app.delete('/donation-requests/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await donationRequestsCollection.deleteOne(filter);
      res.send(result);
    });

    // BLog Content Related API

    app.get('/blogs', verifyToken, async (req, res) => {
      const query = req.query;
      let filter = {};
      if (query.status) {
        filter.status = query.status;
      }
      const result = await contentsCollection.find(filter).toArray();
      res.send(result);
    });

    app.get('/published-blogs', async (req, res) => {
      const result = await contentsCollection
        .find({ status: 'published' })
        .toArray();
      res.send(result);
    });

    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const result = await contentsCollection.findOne({
        _id: new ObjectId(id),
      });

      res.send(result);
    });

    app.post('/blogs', verifyToken, async (req, res) => {
      const blog = req.body;
      const result = await contentsCollection.insertOne(blog);
      res.send(result);
    });

    app.patch('/blogs', verifyToken, async (req, res) => {
      const blog = req.body;

      const filter = { _id: new ObjectId(blog._id) };

      const updateDoc = {
        $set: {
          status: blog.status,
        },
      };

      const result = await contentsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete('/blogs/:id', verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await contentsCollection.deleteOne(filter);
      res.send(result);
    });

    // Funds Related Related API
    app.get('/funds', verifyToken, async (req, res) => {
      const result = await fundsCollection.find().toArray();
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
