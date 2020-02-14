const fs = require("fs")
const path = require("path")
const multer  = require('multer')
const express = require('express')
const child_process = require("child_process")
const { spawn } = require("child_process")

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './')
    },

    filename: function (request, file, callback) {
        callback(null, 'audio.m4a')
    },
})

var upload = multer({ storage : storage }).single('audioFile')

/**
 * http://192.168.1.100:28022/upload-audio
 */
app.post('/upload-audio', (request, response) => {
    upload(request, response, function(error) {
        if (error) {
            return response.end('Error uploading file.')
        }

        /**
         * Use VLC to play the audio file
         * IMPORTANT: Make sure vlc is in PATH variable (test it if you can open vlc from cmd)
         */
        child_process.exec("vlc audio.m4a", (error) => {
            if (error) {
                console.log('\n ** Error: Did you forget to include VLC folder in your PATH variable?')

                response.end('** Error: Something went wrong with playing the audio :(')
            }
        })

        response.end('Audio received!')
    })
})

const server = app.listen(28022, () => {
   console.log('Server running on port 28022')
   console.log('\n')
   console.log('**************')
   console.log('IMPORTANT: Make sure vlc is in your PATH variable!')
   console.log('- you can test it from cmd by typing vlc')
   console.log('**************')
})