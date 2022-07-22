import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  // orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const querySnap = query(
          collection(db, "listings"),
          where("offer", "==", true),
          // orderBy("timeStamp", "desc"),
          limit(10)
        );
        const querySnapshot = await getDocs(querySnap);
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastFetchedListing(lastVisible);
        let listings = [];
        querySnapshot.forEach((doc) => {
          // console.log(doc.data());
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        // console.log(listings);
        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listing");
      }
    };

    fetchListings();
  }, []);

  // PAgnation // Load More
  const onFetchMoreListings = async () => {
    try {
      const q = query(
        collection(db, "listings"),
        where("offer", "==", true),
        startAfter(lastFetchedListing),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      // working on getting sets of fetched data
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastFetchedListing(lastVisible);
      let listings = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      // console.log(listings);
      // we do not want to replace the visible fetch data, we just want to add on to it, although the prev wont be visible
      setListings((prevState) => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listing");
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>There are no current offers</p>
      )}

      {lastFetchedListing && (
        <p className="loadMore" onClick={onFetchMoreListings}>
          Load More
        </p>
      )}
    </div>
  );
};

export default Offers;
