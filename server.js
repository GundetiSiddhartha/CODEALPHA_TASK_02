const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, 'posts.json');

app.use(express.json());
app.use(express.static(__dirname));

// Helper function to read posts safely from posts.json local data storage mock
function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            const defaultPosts = [{ id: 1, username: "Jane Doe", text: "Welcome to SocialSpace Pro workspace ecosystem! 🚀", time: "2 hours ago", likes: 4 }];
            fs.writeFileSync(DATA_FILE, JSON.stringify(defaultPosts, null, 2));
            return defaultPosts;
        }
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (err) {
        return [];
    }
}

// Helper function to write back data array updates safely
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// API: Get live feed stream collection
app.get('/api/posts', (req, res) => {
    res.json(readData());
});

// API: Commit dynamic publication record to storage database
app.post('/api/posts', (req, res) => {
    const posts = readData();
    const { username, text } = req.body;
    
    const newPost = {
        id: Date.now(),
        username: username || "User",
        text: text,
        time: "Just now",
        likes: 0
    };
    
    posts.push(newPost);
    writeData(posts);
    res.status(201).json(newPost);
});

// API: Patch updates specifically for user interaction validation (Liking metrics counters)
app.post('/api/posts/:id/like', (req, res) => {
    const posts = readData();
    const targetId = parseInt(req.params.id);
    const targetPost = posts.find(p => p.id === targetId);
    
    if (targetPost) {
        targetPost.likes += 1;
        writeData(posts);
        return res.json(targetPost);
    }
    res.status(404).json({ error: "Target data cluster path not found" });
});

// Standalone Fallback Middleware for direct dynamic client file returns instead of app.get(*)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🚀 Advanced SocialSpace Engine running!`);
    console.log(`👉 Access URL via terminal loop: http://localhost:${PORT}\n`);
});