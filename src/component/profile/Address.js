import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import { authorizedAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";
import LoadToaster from "../toaster/LoadToaster";

function ManageAddress(props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [locality, setLocality] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const addAddress = async payload => {
    try {
      const customerId = props.context.user.customer.customerId;
      const res = await authorizedAxios(props.context.secretToken).post(`/address/add?customerId=${customerId}`, payload);
      console.log("res:", res);
      props.context.updateUser(props.context.secretToken, props.context.user.username);
      // props.setAddPage(false);
      setIsLoading(false);
      setSuccessMessage(`New Address Line Added Successfully`);
    } catch (err) {
      console.log("err:", err);
      setIsLoading(false);
      setErrorMessage("Server Error");
    }
  }

  const addAddressInformation = e => {
    setIsLoading(true);
    const pinCode = pin;
    addAddress({ name, phone, pinCode, city, state, locality, addressLine, landmark, alternatePhone });
    e.preventDefault();
  }

  const updateAddress = async payload => {
    try {
      const addressId = props.addresses[props.addressLine - 1].addressId;
      const res = await authorizedAxios(props.context.secretToken).put(`/address/edit/${addressId}`, payload);
      console.log("res:", res);
      props.context.updateUser(props.context.secretToken, props.context.user.username);
      // props.setUpdatePage(false);
      setIsLoading(false);
      setSuccessMessage(`Address Line ${props.addressLine} Updated Successfully`);
    } catch (err) {
      console.log("err:", err);
      setIsLoading(false);
      setErrorMessage("Server Error");
    }
  }

  const updateAddressInformation = e => {
    setIsLoading(true);
    const pinCode = pin;
    updateAddress({ name, phone, pinCode, city, state, locality, addressLine, landmark, alternatePhone });
    e.preventDefault();
  }

  useEffect(() => {
    console.log("Update Page Addresses:", props.addresses);

    if (props.updatePage) {
      setName(props.addresses[props.addressLine - 1].name);
      setPhone(props.addresses[props.addressLine - 1].phone);
      setPin(props.addresses[props.addressLine - 1].pinCode);
      setCity(props.addresses[props.addressLine - 1].city);
      setState(props.addresses[props.addressLine - 1].state);
      setLocality(props.addresses[props.addressLine - 1].locality);
      setAddressLine(props.addresses[props.addressLine - 1].addressLine);
      setLandmark(props.addresses[props.addressLine - 1].landmark);
      setAlternatePhone(props.addresses[props.addressLine - 1].alternatePhone);
    }
  }, []);

  return (
    <div className="">
      <LoadToaster
        isLoading={isLoading}
        loadingMessage={(props.updatePage) ? `Updating Address Line ${props.addressLine}` : "Adding New Address"}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />

      {(props.addPage) && <h1 className="text-lg font-medium">Add New Address</h1>}
      {(props.updatePage) && <h1 className="text-lg font-medium">Update Address Line {props.addressLine}</h1>}
      <form onSubmit={(props.updatePage) ? updateAddressInformation : addAddressInformation}>
        <span className="mt-2 flex space-x-4">
          <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input type="text" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" />
        </span>
        <span className="mt-2 flex space-x-4">
          <input type="text" name="pin" id="pin" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Pincode" />
          <input type="text" name="locality" id="locality" value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="Locality" />
        </span>
        <textarea className="mt-2 w-full" name="addressLine" id="addressLine" cols="10" rows="5" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="Address Line (Area and Street)"></textarea>
        <span className="mt-2 flex space-x-4">
          <input type="text" name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City/Town" />
          <input type="text" name="state" id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
        </span>
        <span className="mt-2 flex space-x-4">
          <input type="text" name="landmark" id="landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Landmark (Optional)" />
          <input type="text" name="alternatePhone" id="alternatePhone" value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} placeholder="Alternate Phone (Optional)" />
        </span>
        {(props.addPage) && <button type="submit" className="mt-4 px-6 py-1.5 rounded bg-green-400">Add</button>}
        {(props.updatePage) && <button type="submit" className="mt-4 px-6 py-1.5 rounded bg-green-400">Update</button>}
      </form>
      <button className="mt-4 px-6 py-1.5 rounded bg-slate-400" onClick={(props.updatePage) ? () => props.setUpdatePage(false) : () => props.setAddPage(false)}>Go To Manage Addresses</button>
    </div>
  );
}

function Address() {
  const context = useContext(RootContext);
  const [addresses, setAddresses] = useState([]);
  const [addressLine, setAddressLine] = useState('');
  const [addPage, setAddPage] = useState(false);
  const [updatePage, setUpdatePage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const enableAddPage = (e) => {
    setAddPage(true);
    e.preventDefault();
  }

  const enableUpdatePage = (e, addressLine) => {
    setUpdatePage(true);
    setAddressLine(addressLine);
    e.preventDefault();
  }

  const deleteAddress = async (addressId, addressLine) => {
    try {
      const res = await authorizedAxios(context.secretToken).delete(`/address/delete/${addressId}`);
      console.log("res:", res);
      context.updateUser(context.secretToken, context.user.username);
      setIsLoading(false);
      setSuccessMessage(`Address Line ${addressLine} Deleted Successfully`);
    } catch (err) {
      console.log("err:", err);
      setIsLoading(false);
      setErrorMessage("Server Error");
    }
  }

  const deleteAddressInformation = (addressId, addressLine) => {
    setIsLoading(true);
    deleteAddress(addressId, addressLine);
  }

  useEffect(() => {
    const user = context.user;

    if (user !== null) {
      const addresses = user.customer.addresses;
      console.log("addresses:", addresses);
      setAddresses(addresses);
    }
  }, [context.user]);

  return (
    <div>
      <Helmet><title>Your Profile - Addresses | BookWorm</title></Helmet>

      {
        (!addPage && !updatePage) &&
        <LoadToaster
          isLoading={isLoading}
          loadingMessage={`Deleting Address Line ${addressLine}`}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      }

      {
        (addPage || updatePage) &&
        <ManageAddress
          addPage={addPage}
          updatePage={updatePage}
          setAddPage={setAddPage}
          setUpdatePage={setUpdatePage}
          addressLine={addressLine}
          addresses={addresses}
          context={context}
        />
      }

      {(!addPage && !updatePage) && <h1 className="mb-4 text-xl font-medium">Manage Addresses</h1>}
      {
        (!addPage && !updatePage) &&
        addresses.map((address, id) =>
          <div key={id}>
            <div className="mb-4">
              <h1 className="text-lg font-medium">Address Line {id + 1}</h1>
              <form onSubmit={(e) => enableUpdatePage(e, id + 1)}>
                <span className="mt-2 flex space-x-4">
                  <input type="text" name="name" id="name" defaultValue={address.name} placeholder="Name" />
                  <input type="text" name="phone" id="phone" defaultValue={address.phone} placeholder="10-digit mobile number" />
                </span>
                <span className="mt-2 flex space-x-4">
                  <input type="text" name="pin" id="pin" defaultValue={address.pinCode} placeholder="Pincode" />
                  <input type="text" name="locality" id="locality" defaultValue={address.locality} placeholder="Locality" />
                </span>
                <textarea className="mt-2 w-full" name="addressLine" id="addressLine" cols="10" rows="5" defaultValue={address.addressLine} placeholder="Address Line (Area and Street)"></textarea>
                <span className="mt-2 flex space-x-4">
                  <input type="text" name="city" id="city" defaultValue={address.city} placeholder="City/Town" />
                  <input type="text" name="state" id="state" defaultValue={address.state} placeholder="State" />
                </span>
                <span className="mt-2 flex space-x-4">
                  <input type="text" name="landmark" id="landmark" defaultValue={address.landmark} placeholder="Landmark (Optional)" />
                  <input type="text" name="alternatePhone" id="alternatePhone" defaultValue={address.alternatePhone} placeholder="Alternate Phone (Optional)" />
                </span>
                <span className="space-x-4">
                  <button type="submit" className="mt-4 px-6 py-1.5 rounded bg-amber-600">Update</button>
                  <button type="button" className="mt-4 px-6 py-1.5 rounded bg-red-600" onClick={() => deleteAddressInformation(address.addressId, id + 1)}>Delete</button>
                </span>
              </form>
            </div>
          </div>
        )
      }
      {(!addPage && !updatePage) && <button className="mt-2 px-6 py-1.5 rounded bg-lime-400" onClick={enableAddPage}>Add Addresses</button>}

      {/* <h1 className="text-xl font-medium">Manage Addresses</h1> */}
      {/* <div className="">
        <h1 className="text-lg font-medium">Address Line 1</h1>
        <form>
          <span className="mt-2 flex space-x-4">
            <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <input type="text" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit mobile number" />
          </span>
          <span className="mt-2 flex space-x-4">
            <input type="text" name="pin" id="pin" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Pincode" />
            <input type="text" name="locality" id="locality" value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="Locality" />
          </span>
          <textarea className="mt-2 w-full" name="addressLine" id="addressLine" cols="10" rows="5" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} placeholder="Address Line (Area and Street)"></textarea>
          <span className="mt-2 flex space-x-4">
            <input type="text" name="city" id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City/Town" />
            <input type="text" name="state" id="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
          </span>
          <span className="mt-2 flex space-x-4">
            <input type="text" name="landmark" id="landmark" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Landmark (Optional)" />
            <input type="text" name="alternatePhone" id="alternatePhone" value={alternatePhone} onChange={(e) => setAlternatePhone(e.target.value)} placeholder="Alternate Phone (Optional)" />
          </span>
          <button type="submit" className="mt-4 px-6 py-1.5 rounded bg-amber-600">Save</button>
        </form>
        <button className="mt-4 px-6 py-1.5 rounded bg-red-600">Add Addresses</button>
      </div> */}
    </div>
  );
}

export default Address;
