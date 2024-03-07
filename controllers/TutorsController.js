const fs = require('fs');
const path = require('path');


const tutorsFilePath = path.join(__dirname,'../public/data/data.json');
const { readData, writeData, generateUniqueId } = require('./DatasController');

const tutorsController = {
    goToHome:(req, res) => {
        //check req.cookies exist or not
           if(req.cookies.MyCookie){
               req.session.user = {email : req.cookies.MyCookie};
           }
           
           const tutorsData = readData(tutorsFilePath).tutors || [];
           res.render('index',{
           title:"Your Languages", 
           tutors: tutorsData,
           user: req.session.user ? req.session.user : {email: ""}
          });
       },
    goToTutorsForm:(req,res) => {
        res.render('teacher-form',{
            title:"Teacher form",
            name:null,
            description: null,
            id:null,
            user:req.session.user
        });
    },
    createTutors:(req,res) => {
        const data = readData(tutorsFilePath);

        if(!req.body.name || !req.body.description){
            res.send(400).send('The name and description should not be blank');
        }
        let imagePath = req.file ? req.file.path : '';
        if(imagePath != '')
        imagePath = imagePath.replace(/^public\\/,'');

        let newTutor = {
            id:generateUniqueId(),
            name: req.body.name,
            image:imagePath,
            description: req.body.description
        };
        if(data != null){
            data.tutors.push(newTutor);
            writeData(data,tutorsFilePath);
            res.redirect('/');
        }   
    },

    goToEditForm:(req,res) => {
        const data = readData(tutorsFilePath);    
        data.tutors.forEach(tutor => {
            if(tutor.id === req.params.id){
                res.render('teacher-form',{
                    title:'Update profile',
                    name: tutor.name,
                    description: tutor.description,
                    id: tutor.id,
                    user:req.session.user
                })
            }  
        });
    },

    editTutorsById:(req,res) =>{
        const data = readData(tutorsFilePath);
        if(!req.body.name || !req.body.description){
            res.send(400).send('Teachers must have a name and a description');
        }
        data.tutors.forEach(tutor =>{
            if(tutor.id === req.params.id){
                tutor.name = req.body.name;
                tutor.description = req.body.description;
                
                if(req.file != null){
                    const filePath = path.join(__dirname,`../public/${tutor.image}`)

                    fs.unlink(filePath,(err) =>{
                        if(err){
                            console.log(`Error deleting file: ${err.message}`);
                        }else {
                            console.log('File deleted successfully');
                        }
                    });
                    let image = req.file.path;
                    image = image.replace(/^public\\/, '');
                    tutor.image = image;
                }
            }
        });
        writeData(data,tutorsFilePath);
        res.redirect('/');
    },
    
   deleteTutors:(req,res) =>{
        const data = readData(tutorsFilePath);
        const tutorIndex = data.tutors.findIndex((tutor) => tutor.id === req.params.id);

        const FilePath = path.join(__dirname,`../public/${data.tutors[tutorIndex].image}`);
        fs.unlink(FilePath,(err) => {
            if(err){
                console.log(`Can not delete file: ${err.message}`);
            }else{
                console.log('File deleted successfully')
            }
        });
        data.tutors.splice(tutorIndex,1);
        writeData(data,tutorsFilePath);
        res.redirect('/');
    }
}

module.exports = tutorsController;