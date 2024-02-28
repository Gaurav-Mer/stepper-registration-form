import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Stepper, Step, StepLabel, Button, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Autocomplete, Box, InputAdornment } from '@mui/material';
import "../../App.css";
import * as yup from "yup"
import { yupResolver } from '@hookform/resolvers/yup';
import useGetData from '../../customHooks/apiHooks/useGetData';
import useDebounce from '../debounce/debounceData';
import { useDispatch } from 'react-redux';
import { FormValues, GenderEnum, IDTypeEnum, ResponseInterface } from '../../interfaces/auth';
import { addUserToRegisterList } from '../../store/slice/userDetails';
import { ApartmentIcon, BadgeIcon, BusinessIcon, CottageIcon, FmdGoodIcon, PersonIcon, PersonOutlineIcon, PhoneAndroidIcon } from './iconsLists';

// Define your form steps
const steps = ['Personal Details', 'Address Details'];

const defaultValues = {
    Name: "",
    Age: "",
    Sex: GenderEnum["Male"],
    Mobile: "",
    ID_type: IDTypeEnum["Aadhar"],
    ID: "",
    Country: "",
    City: "",
    State: "",
    Pincode: "",
    Address: ""
};

const StepperOutline = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    const { makeApiRequest, data: countryList } = useGetData();
    const dispatch = useDispatch();



    // handling ERRORS using library named YUP:
    const stepOneSchema = yup.object({
        Name: yup.string()
            .required("Name is Required")
            .min(3, "Minimum 3 characters required").max(50, "Maximum 50 characters required"),
        Sex: yup.string().oneOf(Object.values(GenderEnum)).required(),
        // Mobile: yup.number().integer().nullable().required('Age is required'),
        Age: yup
            .string()
            .required('Age is required')
            .matches(/^[1-9][0-9]*$/, 'Age must be a positive integer'),
        Mobile: yup
            .string().required("Phone number is required")
            .matches(
                /^[6-9]\d{9}$/
                ,
                "Enter a valid phone number"
            ),
        ID_type: yup.string().oneOf(Object.values(IDTypeEnum)).required(),
        ID: yup.string().when('ID_type', (ID_type, schema) => {
            return schema.test({
                name: "ID", message: "ID is required", test: value => {
                    return !value || value.length > 0
                }
            }).when("ID", (Id, schema) => {
                if (!Id[0]) {
                    return schema.required("Govt ID is required");
                }
                return ID_type?.length > 0 ? ID_type[0] === "Aadhar"
                    ? yup.string().matches(/^[2-9]\d{11}$/, 'Invalid Aadhar number').required('Aadhar number is required')
                    : yup.string().matches(/^\w{10}$/, 'Invalid PAN number').required('PAN number is required')
                    : yup.string().required("ID is required");
            })
        }),
        Country: activeStep === 0 ? yup.string().notRequired() : yup.string().required(),
        State: yup.string().notRequired(),
        City: yup.string().notRequired(),
        Pincode: yup.string(),
        Address: yup.string().notRequired(),
    }).required();

    const methods = useForm({
        defaultValues,
        resolver: yupResolver(stepOneSchema),
    });
    const { register, handleSubmit, formState: { errors, isSubmitting }, trigger, reset, setError, watch, setValue } = methods;
    const countryName = watch("Country")

    const sendDataToBackEnd = async (data: FormValues) => {
        return new Promise((resolve, _) => {
            setTimeout(() => {
                resolve({ status: 201, message: "user register successfully!", rData: data })
            }, 3000);
        })
    }


    const handleNext = async (data: FormValues) => {
        try {
            const isValid = await trigger();
            if (isValid) {

                if (activeStep === 1) {
                    //VALIDATING COUNTRY: checking that the value of country is present in data that i fetch 
                    const isPresent = (data?.Country && countryList && countryList?.length > 0) ? countryList?.some((val: Record<any, any>) => val?.name?.common?.toLowerCase() === data?.Country?.toLowerCase()) : (countryList && countryList?.length < 1 && countryName && countryName?.length > 0) ? false : true;
                    if (!isPresent) {
                        return setValue("Country", "", {
                            shouldValidate: true,
                            shouldDirty: true
                        })
                    }

                    const response: ResponseInterface = await sendDataToBackEnd(data) as ResponseInterface;
                    if (response && Object.keys(response)?.length > 0 && response?.status === 201) {
                        dispatch(addUserToRegisterList({ userData: response?.rData }))
                        //api handle karo then reset the data  
                        reset(defaultValues);
                        setActiveStep(0)
                    }
                } else {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }
            }
        } catch (error) {
            setError("root", { type: "custom", message: "Show error comes from the backend here" })
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const debouceCountryData = useDebounce(countryName || "", 600)

    //handling the Countries list on the basis of user input 
    useEffect(() => {
        if (activeStep === 1 && debouceCountryData && debouceCountryData?.length > 0) {
            const myUrl = `https://restcountries.com/v3.1/name/${debouceCountryData}?fields=name,flags`
            makeApiRequest(myUrl);
        }
    }, [debouceCountryData, activeStep]);


    return (
        <div >
            <h2 className='mt-4 d-flex justify-center '>Registration Form</h2>
            <FormProvider {...methods} >
                <form onSubmit={handleSubmit(handleNext)}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const labelProps: {
                                optional?: React.ReactNode;
                                error?: boolean;
                            } = {};
                            if (activeStep === (index) && Object.keys(errors)?.length > 0) {
                                labelProps.error = true;
                            }

                            return (
                                <Step key={label}>
                                    <StepLabel color='secondary' {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <div className='mt-4'>
                        <Grid container spacing={2} >
                            {activeStep === 0 && (
                                <>
                                    <Grid item xs={12} md={12}  >
                                        <TextField InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <PersonIcon />
                                                </InputAdornment>
                                            ),
                                        }} autoComplete='off' fullWidth placeholder='Enter your Name ' size='small' type='text' {...register("Name")} error={errors?.hasOwnProperty("Name")}
                                            helperText={errors?.Name?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={3} md={6}>
                                        <TextField InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <PersonOutlineIcon />
                                                </InputAdornment>
                                            ),
                                        }} autoComplete='off' fullWidth placeholder='Enter your Age ' size='small' type='text' {...register("Age")} error={errors?.hasOwnProperty("Age")}
                                            helperText={errors?.Age?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={9} md={6}>
                                        <TextField InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <PhoneAndroidIcon />
                                                </InputAdornment>
                                            ),
                                        }} autoComplete='off' fullWidth placeholder='Enter your Mobile Number ' size='small' type='text' {...register("Mobile")} error={errors?.hasOwnProperty("Mobile")}
                                            helperText={errors?.Mobile?.message}
                                        />
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="gender-select-label">Gender</InputLabel>
                                            <Select
                                                size='small'
                                                labelId="gender-select-label"
                                                id="gender-select"
                                                label="Gender"
                                                defaultValue={methods.getValues("Sex") || ""}
                                                {...register("Sex")}
                                            >
                                                <MenuItem value={"Male"}>Male</MenuItem>
                                                <MenuItem value={"Female"}>Female</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Govt ID Type</InputLabel>
                                            <Select
                                                size='small'
                                                labelId="govt-ID-type-select-label"
                                                id="govt-ID-type-select"
                                                label="Govt ID Type"
                                                defaultValue={methods.getValues("ID_type") || ""}
                                                {...register("ID_type", {
                                                    required: "Please Select ID Type"
                                                })}
                                            >
                                                <MenuItem value={"Aadhar"}>Aadhar Card</MenuItem>
                                                <MenuItem value={"PAN"}>PAN</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={12}>
                                        <TextField InputProps={{
                                            startAdornment: (
                                                <InputAdornment position='start'>
                                                    <BadgeIcon />
                                                </InputAdornment>
                                            ),
                                        }} autoComplete='off' fullWidth placeholder='Enter Govt Issued ID ' size='small' type='text' {...register("ID")} error={errors?.hasOwnProperty("ID")}
                                            helperText={errors?.ID?.message}
                                        />
                                    </Grid>
                                </>
                            )}
                        </Grid>
                        <div className='formListing d-flex'>
                            {activeStep === 1 && (
                                <>
                                    <TextField InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <CottageIcon />
                                            </InputAdornment>
                                        ),
                                    }} placeholder='Enter your Address ' size='small' type='text' {...register("Address")} error={errors?.hasOwnProperty("Address")}
                                        helperText={errors?.Address?.message}
                                        autoComplete={"none"}
                                    />

                                    <Autocomplete
                                        id="country-select-demo"
                                        options={countryList}
                                        defaultValue={{ name: { common: methods.getValues("Country") || "" } }}
                                        autoHighlight
                                        getOptionLabel={(option: Record<any, any>) => option?.name?.common}
                                        renderOption={(props, option) => (
                                            <Box
                                                component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                                {option.name?.common}
                                            </Box>
                                        )}
                                        renderInput={(params) => {
                                            return (
                                                <TextField
                                                    {...params}
                                                    {...register("Country")}
                                                    label="Choose a country"
                                                    fullWidth
                                                    error={errors?.hasOwnProperty("Country")}
                                                    helperText={errors?.Country?.message}
                                                    size='small'
                                                    autoComplete="none"
                                                    placeholder='Enter your Country'

                                                />
                                            )
                                        }}
                                    />

                                    <TextField InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <BusinessIcon />
                                            </InputAdornment>
                                        ),
                                    }} autoComplete='none' placeholder='Enter your State ' size='small' type='text' {...register("State")} error={errors?.hasOwnProperty("State")}
                                        helperText={errors?.State?.message}
                                    />

                                    <TextField InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <ApartmentIcon />
                                            </InputAdornment>
                                        ),
                                    }} autoComplete='none' placeholder='Enter your City ' size='small' type='text' {...register("City", {
                                        required: "Please Enter City"
                                    })} error={errors?.hasOwnProperty("City")}
                                        helperText={errors?.City?.message}
                                    />

                                    <TextField InputProps={{
                                        startAdornment: (
                                            <InputAdornment position='start'>
                                                <FmdGoodIcon />
                                            </InputAdornment>
                                        ),
                                    }} autoComplete='none' placeholder='Enter your Pincode ' size='small' type='number' {...register("Pincode", {
                                        required: "Please Enter Pincode"
                                    })} error={errors?.hasOwnProperty("Pincode")}
                                        helperText={errors?.Pincode?.message}
                                    />
                                </>
                            )}

                            {/* showing the error form the backend if any */}
                            {errors?.root && <span className='text-red'>{errors?.root?.message}</span>}
                            <div className='d-flex justify-between'>
                                <Button style={{ color: "orange !important" }} disabled={activeStep === 0} onClick={handleBack}>Back</Button>
                                {isSubmitting ? <span className='loading'>loading.....</span> :
                                    <Button variant="contained" type="submit" >{activeStep === steps.length - 1 ? 'Finish' : 'Next'}</Button>}
                            </div>
                        </div>
                    </div>
                </form>
            </FormProvider>

        </div>
    );
};

export default StepperOutline;
