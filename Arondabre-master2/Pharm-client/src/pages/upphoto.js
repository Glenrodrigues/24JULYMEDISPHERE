import React,{useState } from "react";
import { useHistory } from "react-router";
import { Link} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {useLocation} from 'react-router-dom';
import axios from "../util/axios";

//material-ui
import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FileBase64 from 'react-file-base64';
import {FormGroup,Label,FormText,Input} from "reactstrap";
import "../upload.css";
//custom-hook
import useForm from "../hooks/forms";
import "../stile.css"; 
import { signupUser } from "../redux/actions/authActions";
import { Box } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  ...theme.spreadThis,
  title: {
    margin: "48px 0px 10px 0px",
  },
}));

export default function Register(props) {

  const location = useLocation();
  const classes = useStyles();

  const { loading, serverError, errors } = useSelector((state) => state.UI);
  const dispatch = useDispatch();
  const history = useHistory();

  const [loadingProgress, setLoadingProgress] = useState(false);
  const [consoleLogResult, setConsoleLogResult] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);


  const [file, setFile] = useState();
  const [image, setImage ] = useState("");
  const [response, setResponse] = useState(null);
  // const [consoleLogResult, setConsoleLogResult] = useState("");
  // const [loadingProgress, setLoadingProgress] = useState(false);
  
  function handleChange(e) {

      const realimage=e.target.files[0];
      setFilesToBase(realimage);
      //console.log(e.target.files[0]);
      setFile(URL.createObjectURL(e.target.files[0]));

    }

    const setFilesToBase = (realimage)=>{
        const reader = new FileReader();
        reader.readAsDataURL(realimage);
        reader.onload = ()=>{
          setImage(reader.result);
    
        }
      }
  

  
  //access UID it works    
  //console.log(props.location.state.name);
   const ID = props.location.state.name;

  const signupHandle = async (props) => {
    setLoadingProgress(true);
    const UID= Math.round(1+ Math.random() * (1000000-1));

    const newUserData = {
      fileExt:"png",
      imageID: inputs.firstName,
      folder:UID,
      img : image,
    };
    const ty=await fetch(
        'https://hnl6qw9qh4.execute-api.us-east-1.amazonaws.com/Production',
        {
        method: "POST",
        headers: {
           Accept : "application/json",
            "Content-Type": "application.json"
        },
        body : JSON.stringify(newUserData)
       }
   );

  let targetImage = inputs.firstName + ".png";
  const response = await fetch(
        'https://hnl6qw9qh4.execute-api.us-east-1.amazonaws.com/Production/faceocr',
        {
        method: "POST",
        headers: {
            Accept : "application/json",
            "Content-Type": "application.json"
        },
        body : JSON.stringify(targetImage)
       
        }
       
  );
  const responseJson = await response.json();
  
  let reco=ID+".png";
  
  const recresponse = await fetch(
    'https://hnl6qw9qh4.execute-api.us-east-1.amazonaws.com/Production/facerecognize',
    {
    method: "POST",
    headers: {
        Accept : "application/json",
        "Content-Type": "application.json"
    },
    body : JSON.stringify(reco)
   
    }
   
  );
  const recresponseJson = await recresponse.json();
  
  setLoadingProgress(false);
  // setShowNextButton(true);
  console.log(JSON.stringify(recresponseJson.body));
  setConsoleLogResult(JSON.stringify(recresponseJson.body));
  if((JSON.stringify(recresponseJson.body)) =='["Not recognized face"]'){
        setShowNextButton(false);
  }else{
        setShowNextButton(true);
  }
  };

 


  const { inputs, handleInputChange, handleSubmit } = useForm(
    {
      firstName: "",
    },
    signupHandle
  );

  
  let firstNameEmptyError = null;
  

  if (errors) {
    if (typeof errors !== "string") {
      for (let i = 0; i < errors.length; i++) {
        if (errors[i].msg.includes("First Name"))
          firstNameEmptyError = errors[i].msg;
      }
    }
  }
  

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>

        <form noValidate onSubmit={handleSubmit}>

            <div className="col-6 offset-3">
                <FormGroup>

                    <h3>ADD IMAGE</h3>
                    <FormText color="muted">PNG,JPG</FormText>
                            
                            
                    
                    <input type="file" onChange={handleChange} />
                    <img src={file} style={{ width: "320px", height: "300px"}} />
                </FormGroup>        
            </div>

          <Typography>
          <TextField
            id="firstName"
            name="firstName"
            placeholder="First Name"
            onChange={handleInputChange}
            value={inputs.firstName}
            className={classes.textField}
            helperText={firstNameEmptyError}
            error={firstNameEmptyError ? true : false}
            fullWidth
            required
          /><div className="contain"><Button
          className="btn btn-lg btn-block btn-success" type="submit" class="submit-btn"
          style={{
            border:'none',height:'35px',width:'50%', borderRadius:'5px',
            textDecoration: 'none',
            color: 'white',
            marginBottom: '3%',
            backgroundColor: '#157a21',fontWeight:'500',
            '&:hover': {
              backgroundColor: '#5a5c5a',
            },
          }}
        >
         SUBMIT
        </Button></div></Typography>
        {loadingProgress ? (<CircularProgress />) : (
            <div>
              <div className="containe">
                <h1 style={{fontSize:'15px', backgroundColor:'#157a21',color:'white',textTransform:'uppercase',
                fontFamily:'	Times New Roman',fontWeight:'500',}}>
                  {consoleLogResult.replace(/\["|\"]/g,'' ) }</h1>
              </div>
              {showNextButton && ( // use state variable to conditionally show button
            <Link to="/addPharmacy">
                <Button
                  className="btn btn-lg btn-block btn-success"
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    marginBottom: '3%',marginTop:'3%',
                    backgroundColor: '#157a21',
                    '&:hover': {
                      backgroundColor: '#5a5c5a',
                    },
                  }}
                >
                  Next
                </Button>
              </Link>)}
            </div>
          )}
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  );
}