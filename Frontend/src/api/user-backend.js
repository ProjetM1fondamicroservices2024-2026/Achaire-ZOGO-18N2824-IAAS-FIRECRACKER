import axios from 'axios';

const SERVICE_NAME = 'USER-SERVICE';

export const login = async (data) => {
  try {
    const res = await axios.post(`${SERVICE_NAME}/api/auth/login/`, {
      email: data.email,
      password: data.password
    });

    if (res.status !== 200 && res.status !== 201) {
      throw new Error(`Unable to authenticate. Status code: ${res.status}`);
    }

    return res.data;
  } catch (err) {
    console.error('Login API error:', err);
    throw err;
  }
}

export const register = async (data)=>{
    try {

      const res = await axios.post(`${SERVICE_NAME}/api/auth/register/`,{
        username: data.name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword
      }).catch((err)=>{ console.log(err); return err;});
      
      if (res.status !== 200 && res.status !== 201){
        throw new Error(`Unable to authenticate. Status code: ${res.status}`);
      }

      return res.data;
    } catch (err) {
      //console.error('Login API error:', err);
      throw err;
    }
}


export const createAdminUser = async (data)=>{

    const res = await axios.post(`/${SERVICE_NAME}/api/auth/admins/`,{
        username: data.name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password
    }).catch((err)=>console.log(err));


    if (res.status !== 200 && res.status !== 201){
        return console.log(`Unable to authenticate ${res.status}`);
    }

    const resData = await res.data;

    return resData;
}


export const getUsers = async ()=>{

    const res = await axios.get(`/${SERVICE_NAME}/api/auth/users/`).catch((err)=> console.log(err));

    if(res.status !== 200){
        return console.log("Unable to fetch users");
    }

    const data =  res.data;

    return data;
}




export const getUserById = async (id)=>{

    const res = await axios.get(`/${SERVICE_NAME}/api/auth/users/${id}/`).catch((err)=> console.log(err));

    if(res.status !== 200){
        return console.log("Unable to fetch users");
    }

    const data =  res.data;

    return data;
}




export const getLoggedInUser = async ()=>{

    let userId = parseInt(localStorage.getItem('iaas-userId'));

    const res = await axios.get(`/${SERVICE_NAME}/api/auth/users/${userId}`).catch((err)=> console.log(err));

    if(res.status !== 200){
        return console.log("Unable to fetch users");
    }

    const data =  res.data.data;

    return data;
}



// User management routes
export const updateUser = async (userId, data) => {
  const res = await axios.patch(`/${SERVICE_NAME}/api/auth/users/${userId}`, {
    username: data.name,
    email: data.email,
    role: data.role,
    status: data.status
  }).catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log(`Failed to update user ${userId} error code ${res.status}`);
  }

  const resData = await res.data;
  return resData;
};

export const deleteUser = async (userId) => {
  const res = await axios.delete(`/${SERVICE_NAME}/api/auth/users/${userId}/`)
    .catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log(`Failed to delete user ${userId} error code ${res.status}`);
  }

  const resData = await res.data;
  return resData;
};

// USER PROFILE ROUTES
export const updateProfile = async (data) => {
  const id = localStorage.getItem("iaas-userId");
  const token = localStorage.getItem("iaas-token");
  
  try {
    const res = await fetch(`http://localhost:8079/${SERVICE_NAME}/api/auth/users/${id}/`, {
      method: 'PATCH',
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
      username: data.name,
      email: data.email,
      })
    });

    console.log("RESPONSE", res);
    if (!res.ok) {
      throw new Error(`Failed to update your profile. Error code ${res.status}`);
    }
    
    const responseData = await res.json();
    return responseData;

    /*console.log("RESPONSE", res);
    
    if (res.status !== 200 && res.status !== 201) {
      console.log(`Failed to update your profile. Error code ${res.status}`);
      return null;
    }

    return res.data;*/
  } catch (err) {
    console.log('Error updating profile:', err);
    
    if (err.response?.status === 401) {
      console.log('Token may be expired or invalid');
      // Vous pouvez ici rediriger vers la page de login ou rafraîchir le token
    }
    
    throw err; // Re-lancer l'erreur pour que l'appelant puisse la gérer
  }
};

export const deleteProfile = async () => {
  const id = localStorage.getItem("iaas-userId");
  const res = await axios.delete(`/${SERVICE_NAME}/api/auth/users/${id}/`)
  .catch((err) => console.log(err));

  if (res.status !== 200 && res.status !== 201) {
    return console.log(`Failed to delete your profile. Error code ${res.status}`);
  }
  
  const resData = await res.data;
  return resData;
};

export const changeUserPassword = async (data) => {
  const id = localStorage.getItem("iaas-userId");
  const res = await axios.patch(`/${SERVICE_NAME}/api/auth/users/change-password/`, {
    password: data.password,
    new_password: data.newPassword
  })
    .catch((err) => console.log(err));

  if (res.status !== 200 && res.status !== 201) {
    return console.log(`Failed to change user password. Error code ${res.status}`);
  }

  const resData = await res.data;
  return resData;
};

// PASSWORD RESET ROUTES
export const sendResetCode = async (data) => {
  try
  {
      const res = await axios.post(`${SERVICE_NAME}/api/auth/users/send-reset-code`, {
        email: data.email
      })
    
      if (res.status !== 200) {
        return console.log(`Failed to send code to email ${data.email} error code ${res.status}`);
      }
    
      return res;
  } catch (err) {
      console.log("RESULT", err);
      return err;
  }
};

export const verifyResetCode = async (data) => {
  const res = await axios.post(`${SERVICE_NAME}/api/auth/users/verify-code`, {
    email: data.email,
    code: data.code
  }).catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log(`Failed to verify code sent to your email ${data.email} error code ${res.status}`);
  }

  const resData = await res.data;
  return resData;
};

export const resetUserPassword = async (data) => {
  const res = await axios.post(`${SERVICE_NAME}/api/auth/users/reset-password`, {
    email: data.email,
    code: data.code,
    new_password: data.newPassword,
  }).catch((err) => console.log(err));

  if (res.status !== 200) {
    return console.log(`Failed to reset password for user email ${data.email} error code ${res.status}`);
  }

  const resData = await res.data;
  return resData;
};







