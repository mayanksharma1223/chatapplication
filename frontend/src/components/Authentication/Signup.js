import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack,useToast } from '@chakra-ui/react'
import axios from "axios";
import {useHistory} from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';

const Signup = () => {

    const [name, setName] = useState();
    const [email,setEmail]=useState();
    const [confirmpassword,setConfirmpassword]=useState();
    const [password,setPassword]=useState();
    const [pic,setPic]=useState();
    const [show,setShow]=useState(false);
    const [picLoading,setPicLoading]=useState(false);
    const toast = useToast();
    const history=useHistory();
    const {setUser}=ChatState();


    const handleClick=()=>setShow(!show);

    const postDetails=(pics)=>{
        setPicLoading(true);
        if(pics===undefined){
            toast({
                title: 'Please select an image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom"
              });
              return;
        }
        console.log(pics);
        if(pics.type==="image/jpeg" || pics.type==="image/png"){
            const data= new FormData();
            data.append("file",pics)
            data.append("upload_preset","chatapp")
            data.append("cloud_name","dqrrvzkt0")
            fetch("https://api.cloudinary.com/v1_1/dqrrvzkt0/image/upload",{method:"post",
            body:data,}).then((res)=>res.json())
            .then(data=>{
                setPic(data.url.toString());
                console.log(data.url.toString());
                setPicLoading(false);
            }).catch((err)=>{
                console.log(err);
                setPicLoading(false);
            })
        }else{
            toast({
                title: 'Please select an image!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom"
              });
              setPicLoading(false);
              return;
        }
    };

    const submitHandler=async()=>{
        setPicLoading(true);
        if(!name ||!email || !password || !confirmpassword){
            toast({
                title: 'Please fill all the fields!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom"
              });
              setPicLoading(false);
              return;
        }
        if(password!== confirmpassword){
            toast({
                title: 'Password do not match!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom"
              });
              return;
        }
        console.log(name,email,password,pic);
        try {
            const config={
                headers:{
                    "Content-Type":"application/json",
                },
            };
            const {data}=await axios.post("/api/user",{name,email,password,pic},
            config);
            console.log(data);
            toast({
                title: 'Registration successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position:"bottom"
              });
              localStorage.setItem("userInfo",JSON.stringify(data));
              setPicLoading(false);
              setUser(data)
              history.push('/chats')
        } catch (error) {
            toast({
                title: "Error occured",
                description:error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:"bottom"
              });
              setPicLoading(false);
        }
    };

    return (
        <VStack spacing='5px' color='black'>
            <FormControl id='first-name' m='1px' isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder='Enter Your Name' onChange={(e) => setName(e.target.value)}/>
            </FormControl>
            <FormControl id='email' m='1px' isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder='Enter Your Email' type='email' onChange={(e) => setEmail(e.target.value)}/>
            </FormControl>
            <FormControl id='password' isRequired m='1px'>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input type={show?"text":"password"} placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)}/>
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show?'hide':"show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id='password' isRequired m='1px'>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input type={show?"text":"password"} placeholder='Confirm Password' onChange={(e) => setConfirmpassword(e.target.value)}/>
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show?'hide':"show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl >
            <FormControl id="pic" m='1px'>
                <FormLabel>Upload your Picture</FormLabel>
                <Input type="file" p={1.5} accept="image/*" onChange={(e)=> postDetails(e.target.files[0])}/>
            </FormControl>

            <Button colorScheme='blue' width='100%' style={{marginTop:15}} onClick={submitHandler} isLoading={picLoading}> Sign Up  </Button>
        </VStack>
    )
}

export default Signup;