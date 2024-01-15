import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';


const app = express();
const PORT = 3001;

// Connect to MongoDB
mongoose.connect('mongodb+srv://s6301012630061:1234@cluster0.cfjkr9t.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connection successfully'))
  .catch((err) => console.error(err));

  const projectSchema = new mongoose.Schema({
    project_name: {
      type: String,
      required: true,
    },
    project_type: {
      type: String,
      required: true,
    },
  });
  
  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    projects: {
      type: [projectSchema],
      default: [], 
    },
  });
  
const User = mongoose.model('User', userSchema);


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log(`user ${username} pass ${password}`);
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username password');

    res.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/project/add', async (req, res) => {
  const { project_name, project_type , username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newProject = { project_name, project_type  };
    user.projects.push(newProject);
    await user.save();

    res.json({ message: 'Project added to user successfully' });
  } catch (error) {
    console.error('Error adding project to user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/projects', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const projects = user.projects;
    res.json({ projects });
  } catch (error) {
    console.error('Error fetching projects of user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/delete', async (req, res) => {
  const { username, project_name, project_type } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.projects = user.projects.filter((project) => project.project_name !== project_name || project.project_type !== project_type);
    await user.save();

    res.json({ message: 'Project deleted from user successfully' });
  } catch (error) {
    console.error('Error deleting project from user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default User;