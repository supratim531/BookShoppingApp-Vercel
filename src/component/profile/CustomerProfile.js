import React, { useContext, useEffect, useState } from "react";
import { authorizedAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";
import LoadToaster from "../toaster/LoadToaster";

function CustomerProfile() {
  const context = useContext(RootContext);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const updateCustomer = async payload => {
    try {
      const customerId = context.user.customer.customerId;
      const res = await authorizedAxios(context.secretToken).put(`/customer/edit/${customerId}`, payload);
      console.log("res:", res);
      context.updateUser(context.secretToken, context.user.username);
      setIsLoading(false);
      setSuccessMessage("Personal Information Updated Successfully");
    } catch (err) {
      console.log("err:", err);
      setIsLoading(false);
      setErrorMessage("Server Error");
    }
  }

  const updatePersonalInformation = e => {
    setIsLoading(true);
    const firstName = fname;
    const lastName = lname;
    updateCustomer({ firstName, lastName, gender, email, phone });
    e.preventDefault();
  }

  useEffect(() => {
    const user = context.user;

    if (user !== null) {
      console.log("CustomerProfile.jsx: user:", context.user);
      const customer = user.customer;

      if (customer !== null) {
        setFname((customer.firstName) ? customer.firstName : '');
        setLname((customer.lastName) ? customer.lastName : '');
        setGender((customer.gender) ? customer.gender : '');
        setEmail((customer.email) ? customer.email : '');
        setPhone((customer.phone) ? customer.phone : '');
      }
    }
  }, [context.user]);

  return (
    <div>
      <LoadToaster
        isLoading={isLoading}
        loadingMessage={"Updating Personal Information"}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />

      <h1 className="text-xl font-medium">Personal Information</h1>
      <div className="">
        <form onSubmit={updatePersonalInformation}>
          <span className="mt-2 flex space-x-4">
            <input type="text" name="fname" id="fname" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="First Name" />
            <input type="text" name="lname" id="lname" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Last Name" />
          </span>
          <span className="mt-4 flex flex-col">
            <span>Your Gender</span>
            <span className="space-x-8">
              <span className="space-x-2">
                <input type="radio" name="gender" id="male" value={"M"} checked={gender === 'M'} onChange={(e) => setGender(e.target.value)} />
                <label className="cursor-pointer" htmlFor="male">Male</label>
              </span>
              <span className="space-x-2">
                <input type="radio" name="gender" id="female" value={"F"} onChange={(e) => setGender(e.target.value)} checked={gender === 'F'} />
                <label className="cursor-pointer" htmlFor="female">Female</label>
              </span>
            </span>
          </span>
          <span className="mt-4 flex flex-col">
            <span className="text-xl font-medium">Email Address</span>
            <input className="mt-2" type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
          </span>
          <span className="mt-4 flex flex-col">
            <span className="text-xl font-medium">Mobile Number</span>
            <input className="mt-2" type="text" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
          </span>
          <button type="submit" className="mt-4 px-6 py-1.5 rounded bg-amber-600">Save</button>
        </form>
      </div>
    </div>
  );
}

export default CustomerProfile;
