import { supabase } from "../../services/supabase";

// eslint-disable-next-line react/prop-types
export const Card = ({ image, CDNURL, user, getImages }) => {
  const handleDelete = async (imageName) => {
    const { error } = await supabase.storage
      .from("images")
      .remove([user + "/" + imageName]);
    if (error) {
      console.log(error);
    } else {
      getImages();
    }
  };

  return (
    <section className="container flex column ">
      <img
        className="avatar image"
        // eslint-disable-next-line react/prop-types
        src={CDNURL + user + "/" + image}
        alt="alt"
      />
      <button className="button delete" onClick={() => handleDelete(image)}>
        DELETE
      </button>
    </section>
  );
};
