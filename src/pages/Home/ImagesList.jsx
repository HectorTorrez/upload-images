import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { Card } from "./Card";

const CDNURL =
  "https://wplizvbfvzobvdildtzx.supabase.co/storage/v1/object/public/images/";

export const ImagesList = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState(null);
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  const getImages = async () => {
    const { data: user } = await supabase.auth.getSession();

    const { data, error } = await supabase.storage
      .from("images")

      .list(user.session.user.id + "/", {
        limit: 20,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (data !== null) {
      setImages(data);
    } else {
      console.error("We have a " + error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: user } = await supabase.auth.getSession();
      setUser(user.session.user.id);
    };
    return () => getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user]);

  const handleChange = (e) => {
    let file = e.target.files[0];
    setFiles(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: user } = await supabase.auth.getSession();
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("images")
      .upload(user.session.user.id + "/" + crypto.randomUUID(), files);

    if (data) {
      getImages();
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <section className="column  flex flex-center ">
      <button onClick={handleLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
      <div className="col-6 form-widget">
        <form onSubmit={handleSubmit} className="form-widget">
          {/* <label htmlFor="name">
            <p className="description">Name</p>
            <input
              className="inputField"
              type="text"
              name="name"
              id="name"
              placeholder="Name"
            />
          </label> */}

          <label htmlFor="image">
            <h1 className="description h1">Upload Image</h1>
            <input
              onChange={handleChange}
              className="inputField"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              name="image"
              id="image"
            />
          </label>

          <button className="button block" type="submit">
            {loading ? <span>Loading</span> : <span>Send the image</span>}
          </button>
        </form>
      </div>
      <section className="container flex column flex-center">
        {images.map((image) => {
          return (
            <Card
              key={image.name}
              user={user}
              CDNURL={CDNURL}
              image={image.name}
              getImages={getImages()}
            />
          );
        })}
      </section>
    </section>
  );
};
