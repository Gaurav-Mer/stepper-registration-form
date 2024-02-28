import { Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import StepperOutline from '../components/registerForm/stepperOutline';
import Tabledata from '../components/table';
import "../App.css";

function Register() {

    return (
        <Grid container gap={1} >
            <Grid item xs={12}>
                <div className="formContainer">
                    <StepperOutline />
                    <div className='d-flex justify-center '><h5 >Account Already ?</h5>
                        <Link to={"/login"} className='ml-2  mt-2 text-blue cursor-pointer'>
                            <button className='login-btn'>LOGIN</button>
                        </Link>
                    </div>
                </div>
            </Grid>
            <Grid item xs={12} className='registerDiv'>
                <p className='registerText ' >Register User List</p>
                <Tabledata />
            </Grid>
        </Grid>
    )
}

export default Register;
