import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Image from "../Image.jsx";
import { useContext } from "react"; // Import useContext for user authentication context
import { UserContext } from "../UserContext"; // Import your UserContext

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const { user } = useContext(UserContext); // Get user information from context

  useEffect(() => {
    axios.get('/places').then(response => {
      setPlaces(response.data);
    });
  }, []);

  // Function to render the Link conditionally based on user login status
  const renderLink = (place) => {
    if (user) {
      // User is logged in, provide the link to the place
      return (
        <Link to={'/place/'+place._id}>
          <div className="bg-gray-500 mb-2 rounded-2xl  flex">
            {place.photos?.[0] && (
              <Image className="rounded-2xl object-cover aspect-square" src={place.photos?.[0]} alt=""/>
            )}
          </div>
          <h2 className="font-bold">{place.address}</h2>
          <h3 className="text-sm text-gray-500">{place.title}</h3>
          <div className="mt-1">
            <span className="font-bold">${place.price}</span> per night
          </div>
        </Link>
      );
    } else {
      // User is not logged in, provide a link to the login page
      return (
        <Link to="/login">
          <div className="bg-gray-500 mb-2 rounded-2xl flex">
            {place.photos?.[0] && (
              <Image className="rounded-2xl object-cover aspect-square" src={place.photos?.[0]} alt=""/>
            )}
          </div>
          <h2 className="font-bold">{place.address}</h2>
          <h3 className="text-sm text-gray-500">{place.title}</h3>
          <div className="mt-1">
            <span className="font-bold">${place.price}</span> per night
          </div>
        </Link>
      );
    }
  };

  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
      {places.length > 0 && places.map(place => (
        <div key={place._id} >
          {renderLink(place)}
        </div>
      ))}
    </div>
  );
}
