import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import uploadImage from "../components/uploadImage";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const Category_Type = [
    "Agriculture", "Business", "Education", "Entertainment",
    "Art", "Investment", "Uncategorized", "Weather"
  ];

  const createPost = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";
      if (thumbnail) {
        const uploadRes = await uploadImage(thumbnail);
        imageUrl = uploadRes.secure_url; 
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/posts`,
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

      if (response.status === 201) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="bg-white border border-4 rounded-lg shadow relative m-10 mt-36">
      <div className="p-6 space-y-6">
        <form onSubmit={createPost}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Title
              </label>
              <input
                type="text"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Category
              </label>
              <select
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {Category_Type.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Upload Post
              </label>
              <input
                type="file"
                onChange={(e) => setThumbnail(e.target.files[0])}
                accept=".jpg,.png,.jpeg"
                required
              />
            </div>
            <div className="col-span-full">
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Description
              </label>
              <textarea
                rows="6"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-4"
                placeholder="Details"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 rounded-b">
            <button
              className="text-white bg-cyan-600 hover:bg-cyan-700 px-5 py-2.5 rounded-lg"
              type="submit"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
