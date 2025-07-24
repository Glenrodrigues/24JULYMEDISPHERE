import React, { Component } from 'react';
import { Link,useNavigate} from "react-router-dom";
import FileBase64 from 'react-file-base64';
import {Button,Form,FormGroup,Label,FormText,Input} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import axios from "../util/axios";

import "../upload.css";


class Upload extends Component {

    constructor(props){
        super(props);
        this.state = {
            confirmation : "",
            isLoading : "",
            files : "",
            Year : "",
            Gender: "",
            Adhar_number: "",
            Country: "",
            UID:"",
            adharImage: null,
      }

    this.handleChane= this.handleChane.bind(this);
    
    }

   

    

    handleChane(event){
        event.preventDefault();
        const target = event.target;
        const value=target.value;
        const name=target.name;

        this.setState({name:value});

    }

    //async handleSubmit(event){
      //  event.preventDefaulr();
       // this.setState({confirmation : "Uploading..."})
        //const {data} = await axios.post('/auth/Extract',OCRBody);

    //}



    async getFiles(files){
        this.setState({
            isLoading : "Extracting data",
            files : files

    });


    const check = (e)=>{
        if (e.state.files[0]>0){
            console.log('gdsagfdsagfdsaq')

        }
        else{
            console.log('not done')
        }

    }









    const UID= Math.round(1+ Math.random() * (1000000-1));
    
    var date={
        fileExt:"png",
        imageID: UID,
        folder:UID,
        img : this.state.files[0].base64
    };
    

    //AWS REST API call 
    
    this.setState({confirmation : "Processing..."})
    const ty=await fetch(
        'https://ghys5o30t2.execute-api.us-east-1.amazonaws.com/Production',
        {
        method: "POST",
        headers: {
           Accept : "application/json",
            "Content-Type": "application.json"
        },
        body : JSON.stringify(date)
       }
   );
   

    




    let targetImage= UID + ".png";
    this.setState({confirmation : "extracting..."})
    const response = await fetch(
        'https://ghys5o30t2.execute-api.us-east-1.amazonaws.com/Production/ocr',
        {
        method: "POST",
        headers: {
            Accept : "application/json",
            "Content-Type": "application.json"
        },
        body : JSON.stringify(targetImage)
       
        }
       
    );

    this.setState({confirmation : "encrypting data"})

    const OCRBody = await response.json();
    console.log("OCRBody",OCRBody);

    const newUserData = {
        Year: OCRBody.body[0],
        Gender:OCRBody.body[1],
        Adhar_number:OCRBody.body[2],
        Country:OCRBody.body[3],
    };
    //console.log(newUserData);

    this.setState({Year:OCRBody.body[0] })
    this.setState({Gender :OCRBody.body[1] })
    this.setState({Adhar_number:OCRBody.body[2]})
    this.setState({Country:OCRBody.body[3]})
    this.setState({UID:UID})

    //sending data to backend 
    const {data} = await axios.post('/auth/Extract',newUserData)

    //<input
      //                      accept="image/*"
                            // style={{ display: "none" }}
        //                    id="raised-button-file"
          //                  multiple
            //                type="file"
              //              name="avatar"
                            //onDone={this.getFiles.bind(this)}/>
                         //</div>


    
    
    

    const adharImage = this.state.files[0].base64;
    this.setState({ adharImage });
    }

    render() { 
        const processing = this.state.confirmation;
        const ID = this.state.UID;
        const files = this.state.files;
        const adharImage = this.state.adharImage;
        return ( 
            <div className="row">
                <div className="col-6 offset-3">
                <div className="upload-container">
                    <FormGroup>
                        <h3 className="text-danger">{processing}</h3>

                        
                        <h6>Upload Adhar card</h6>
                        <FormText color="muted">PNG, JPG</FormText>
                    
                        <div className="form-group files color">
                            <FileBase64 
                                multiple={true}
                                onDone={this.getFiles.bind(this)}
                            />
                        </div>
                    </FormGroup> 
                     </div>
                    {adharImage && (
                        <div>
                        <img
                            src={`data:image/png;base64,${adharImage}`} // setting the src attribute to display the uploaded image
                            alt="Uploaded Aadhar Card"
                        />
                        </div>
                    )} 
    
                    {this.state.confirmation=="encrypting data" && (
                        <Link to={{
                            pathname: '/upphoto',
                            state: {name: ID}
                        }}> 
                            <Button className="btn btn-lg btn-block btn-success" 
                            style={{ display: this.state.files ? 'block' : 'none', 
                            margin: 'auto', width: '50%',textdecoration: 'none', }}
                        >
                                Next
                            </Button>
                        </Link>
                    )}  
                </div>
                <div className="container">
  
                {this.state.confirmation=="encrypting data" && (
                        <div>
                            <h6>Uploaded Adhar card:</h6>
                            <img src={this.state.files[0].base64} style={{ width: "320px", height: "200px",marginBottom:"150px" }} alt="Uploaded Adhar card"  />
                        </div>
                        )}</div>
            </div>
            
        );
    }
    
 }
  
export default Upload;