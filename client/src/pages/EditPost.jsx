import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import uploadImage from "../components/uploadImage";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/${id}`
        );
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCategory(response.data.category);
        setThumbnail(response.data.thumbnail); // ✅ existing Cloudinary URL
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post data.");
      }
    };
    if (id) getPost();
  }, [id]);

  const editPost = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = thumbnail;
      if (thumbnail instanceof File) {
        const uploadRes = await uploadImage(thumbnail);
        imageUrl = uploadRes.secure_url;
      }

      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/posts/${id}`,
        {
          title,
          category,
          description,
          thumbnail: imageUrl,
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const Category_Type = [
    "Agriculture", "Business", "Education", "Entertainment",
    "Art", "Investment", "Uncategorized", "Weather"
  ];

  return (
    <div className="bg-white border border-4 rounded-lg shadow relative m-10 mt-36">
      <div className="p-6 space-y-6">
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={editPost}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="text-sm font-medium">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {Category_Type.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="text-sm font-medium">Upload Post</label>
              <input
                type="file"
                onChange={(e) => setThumbnail(e.target.files[0])}
                accept=".jpg,.png,.jpeg"
              />
              {typeof thumbnail === "string" && (
                <img src={thumbnail} alt="preview" className="w-32 mt-2 rounded" />
              )}
            </div>
            <div className="col-span-full">
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 rounded-b">
            <button className="bg-cyan-600 text-white px-5 py-2.5 rounded-lg">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
