import { useEffect, useState } from "react";
import Perks from "../Perks";
import PhotoUploader from "../PhotoUploader";
import AccountNav from "../AccountNav";
import axios from "axios";
import { Navigate, useParams } from "react-router";

export default function PlacesFormPage() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  const [inputFieldsFilled, setInputFieldsFilled] = useState(false); // Track if input fields are filled

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price);
    });
  }, [id]);

  async function savePlace(ev) {
    ev.preventDefault();
    // Check if all required fields are filled
    if (
      !title ||
      !address ||
      addedPhotos.length === 0 ||
      !description ||
      perks.length === 0 ||
      !extraInfo ||
      !checkIn ||
      !checkOut ||
      !maxGuests ||
      !price
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      // update
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      // new place
      await axios.post("/places", placeData);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {/* Place Title */}
        <h2 className="text-2xl mt-4">Title</h2>
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="Title, e.g., My Lovely Apartment"
          required
        />

        {/* Address */}
        <h2 className="text-2xl mt-4">Address</h2>
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="Address, e.g., Clement Town, Uttarakhand"
          required
        />

        {/* Photos */}
        <h2 className="text-2xl mt-4">Photos</h2>
        <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

        {/* Description */}
        <h2 className="text-2xl mt-4">Description</h2>
        <textarea
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          required
        />

        {/* Perks */}
        <h2 className="text-2xl mt-4">Perks</h2>
        <div className="flex mt-2 gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {/* Extra Info */}
        <h2 className="text-2xl mt-4">Extra Info</h2>
        <textarea
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
          required
        />

        {/* Check-in, Check-out, Max Guests, Price */}
        <h2 className="text-2xl mt-4">Check-in & Check-out</h2>
        <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3>Check-in Time</h3>
            <input
              type="text"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              placeholder="14:00"
              required
            />
          </div>
          <div>
            <h3>Check-out Time</h3>
            <input
              type="text"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              placeholder="17:00"
              required
            />
          </div>
          <div>
            <h3>Max Guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
              placeholder="1"
              required
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per Night</h3>
            <input
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              required
            />
          </div>
        </div>

        {/* Save Button */}
        <div>
          <button className="primary my-4">Save</button>
        </div>
      </form>
    </div>
  );
}
