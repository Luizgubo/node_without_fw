const fs = require('fs');
const path = require('path');


let lib = {}

lib.baseDir = path.join(__dirname, '/../.data/')

lib.create = (dir, file, data, callback) => {

    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',(err,fileDescriptor) => {
        
        if(!err && fileDescriptor){
            
            let stringData = JSON.stringify(data);

            fs.writeFile(fileDescriptor, stringData, (err) => {
                if(!err) {
                    fs.close(fileDescriptor, (err) => {
                        if(!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            })
        } else {
            callback("Couldn't create new file, it may already exist");
        }
    });
}



lib.read = (dir, file, callback) => {

    fs.readFile(lib.baseDir+dir+'/'+file+'.json', 'utf8', (err, data) => {
        callback(err, data)
    });
}



lib.update = (dir, file, data, callback) => {
    fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', (err, fileDescriptor) => {
        
        if(!err && fileDescriptor) {
        
            let stringData = JSON.stringify(data);
        
            fs.truncate(fileDescriptor, (err) => {
                
                if(!err) {

                    fs.writeFile(fileDescriptor,stringData, (err, data) => {
                        
                        if(!err) {

                           fs.close(fileDescriptor, (err) => {

                            if(!err) {
                                callback(false)
                            
                            } else {
                                callback("there was an error closing the file");
                            }

                           });

                        } else {

                            callback("Error writing to existing file");
                        }
                    });
                
                } else {
                    callback("Error truncating file");
                }
            });


        } else {
            callback("Couldn't open the file, it may not exist yet");
        }
    });
}



lib.delete = (dir, file, callback) => {
    fs.unlink(lib.baseDir+dir+'/'+file+'.json', (err) => {
        if(!err) {

            callback(false)
        } else {
            callback('Error deleting the file');
        }
    })
}



module.exports = lib