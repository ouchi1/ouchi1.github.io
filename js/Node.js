// save-article.js - Run this locally or as a server
import { exec } from 'child_process';
import fs from 'fs';

function gitCommitAndPush(message) {
    exec('git add .', (err) => {
        if (err) throw err;
        exec(`git commit -m "${message}"`, (err) => {
            if (err) throw err;
            exec('git push origin main', (err) => {
                if (err) throw err;
                console.log('✅ Pushed to GitHub!');
            });
        });
    });
}

// Call this when article is saved
gitCommitAndPush('Update news article');