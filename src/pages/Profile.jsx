import React from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  // query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

const Profile = () => {
  const auth = getAuth();

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserListings = async () => {
      // const listingRef = collection(db, "listings");
      // const q = query(
      //   listingRef,
      //   where("userRef", "==", auth.currentUser.uid),
      //   orderBy("timeStamp", "desc")
      // );
      const listingRef = await getDocs(
        collection(db, "listings"),
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timeStamp", "desc")
      );
      // console.log(auth.currentUser.uid);
      let listings = [];

      listingRef.forEach((doc) => {
        // console.log(doc.data().userRef);

        return listings.push({
          data: doc.data(),
          id: doc.id,
        });
      });
      // FETCH ALL THE LISTINGs THEN DISPLAY THE ON THAT IS FOR THE PARTICULAR USER
      const filterListing = listings.filter((doc) => {
        return doc.data.userRef == auth.currentUser.uid;
      });
      // console.log(filterListing);

      setListings(filterListing);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onLongOut = () => {
    auth.signOut();
    toast.warning("You are logged out");
    navigate("/sign-in");
  };

  const onClick = () => {
    changeDetails && onSubmit();
    setChangeDetails((prevState) => !prevState);
  };
  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name: name,
        });
        toast.success("Update Successful");
      }
    } catch (error) {
      toast.error("Could not update profile details");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      [e.target.id]: e.target.value,
    }));
  };
  const onDelete = async (listingId) => {
    if (window.confirm("Are you sure you want to delete")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Listing deleted successfully");
    }
  };
  const onEdit = (listingId) => navigate(`/edit-listings/${listingId}`);

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLongOut}>
          Log Out
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={onClick}>
            {changeDetails ? "done" : "change"}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="email"
              id="email"
              className={!changeDetails ? "profileEmail" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to="/create-listings" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right"></img>
        </Link>
        {!loading && listings.length > 0 && (
          <>
            <p className="listingText">Your Listings</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
