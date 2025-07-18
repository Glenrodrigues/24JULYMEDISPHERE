import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import useForm from "../hooks/forms";
import '../App.css';

import axios from "../util/axios";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Pharmacyinfo from "../components/Pharmacyinfo";
import Pharmacyitems from "../components/Pharmacyitems";
import url from "socket.io-client/lib/url";


//import {ToastContainer,toast} from "react-toastify";
//import "react-toastify/dist/ReactTostify.css";




const Pre = () => {
  const Pharmacy = useSelector((state) => state.data.Pharmacy);
  const [image, setImage ] = useState("");
  const [ url, setUrl ] = useState("");

  const handleImage=(e)=>{
    const file=e.target.files[0];
    setUrl(URL.createObjectURL(e.target.files[0]));
    setFilesToBase(file);
    //console.log(file);

  }
  const setFilesToBase = (file)=>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = ()=>{
      setImage(reader.result);

    }
  }

  //submit

  const submitForm = async (e) =>{

    const newUserData = {
      Doc: inputs.Doc,
      seller_email:Pharmacy.email,
      img:image,
      Yname:inputs.Yname,
      Aptname:inputs.Aptname,
      Local:inputs.Local,
      street:inputs.Street,
      Zip:inputs.Zip,
      Phone:inputs.Phone,
    };
    
    console.log(newUserData,'dfghjkfghj');
    const {data} = await axios.post('/auth/Prescription',newUserData)

    //e.preventDefault();
    //try{
      
      //const {data} = await axios.post('/auth/Prescription',newUserData)
      
    //}catch(error){

     // console.log(error)

    //} 

  }


  const { inputs, handleInputChange , handleSubmit } = useForm(
    {
      Doc:"",
      Yname:"",
      Aptname:"",
      Local:"",
      street:"",
      Zip:"",
      Phone:"",

    },
    submitForm
  );



  
  return (
    <main className="App">
      <section className="left-side">
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="file" onChange= {handleImage}/>
          </div>

<TextField
    id="Doc_name"
    name="Doc"
    placeholder="Name of Doctor"
    onChange={handleInputChange}
    value={inputs.Doc}
    required
/>

<TextField
    id="Your Name"
    name="Yname"
    placeholder="Your Name"
    onChange={handleInputChange}
    value={inputs.Yname}
    required
/>

<TextField
    id="aptName"
    name="Aptname"
    placeholder="Apt Name"
    onChange={handleInputChange}
    value={inputs.Aptname}
    required
/>

<TextField
    id="Locality"
    name="Local"
    placeholder="Locality"
    onChange={handleInputChange}
    value={inputs.Local}
    required
/>

<TextField
    id="Street"
    name="street"
    placeholder="Street"
    onChange={handleInputChange}
    value={inputs.street}
    required
/>

<TextField
    id="ZipCode"
    name="Zip"
    placeholder="Zip_code"
    onChange={handleInputChange}
    value={inputs.Zip}
    required
/>

<TextField
    id="Phone"
    name="Phone"
    placeholder="Phone_no"
    onChange={handleInputChange}
    value={inputs.Phone}
    required
/>
 
        
          <Button
            type="submit"
            onclick = "clearForm()"
            className="btn">
            Submit
          </Button>
        
        </form>
      </section>
      <section className="right-side">
        <p>YOUR PRESCRIPTION WILL BE DISPLAYED HERE</p>
          <img src={url} alt="Preview" style={{ width: "600px", height: "600px" }}className="displayed-image"/>
      </section>
    </main>
  
  )
  }
  export default Pre;





 {/*
    <div>
    <div>
    <form noValidate onSubmit={handleSubmit}>
          <TextField
            id="email"
            name="email"
            label="email"
            onChange={handleInputChange}
            value={inputs.email}
            required
          />
      <input type="file" onChange= {handleImage}></input>
      <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Sign-up
          </Button>
      </form>
      
    </div>
    <div>
      <h1>Uploaded image will be displayed here</h1>
      
    </div>
  </div>
*/} 










//natart karo e
//Handling images with Cloudinary in React - LogRocket Blog


{/*
import React, { useState } from "react";

function Pre(){
  const[image,setImages]=useState("")

  const submitImage=()=>{
    const data = new FormData()
    data.append("file",image)
    data.append("upload_preset","GlenDemo")
    data.append("cloud_name","dthuolnrk")

    fetch("https://api.cloudinary.com/v1_1/dthuolnrk/image/upload",{
      method:"post",
      body:data

    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data);
    }).catch((err)=>{
      console.log(err)

    })
     
    

  }
  return (
    <>
    <div>
      <div>
        <input type="file" onChange={(e)=>{setImages(e.target.files[0])}}/>
        <button onClick={submitImage}>Upload </button>


      </div>
    </div>
    </>


    
  )
}


export default Pre

*/}








































