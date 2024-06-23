import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Search,
  LogIn,
  LogOut,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

const PromptOverflowApp = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [newPost, setNewPost] = useState({
    title: "",
    prompt: "",
    model: "",
    goal: "",
    tags: "",
  });
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    // Load posts and users from localStorage
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setPosts(savedPosts);
    setUsers(savedUsers);

    // Check for logged in user
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setCurrentUser(loggedInUser);
    }
  }, []);

  useEffect(() => {
    // Save posts to localStorage whenever they change
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handleNewPostChange = (event) => {
    setNewPost({ ...newPost, [event.target.name]: event.target.value });
  };

  const handleNewPostSubmit = () => {
    const newPostWithId = {
      ...newPost,
      id: Date.now(),
      likes: 0,
      dislikes: 0,
      comments: [],
      tags: newPost.tags.split(",").map((tag) => tag.trim()),
      userId: currentUser.id,
    };
    setPosts([newPostWithId, ...posts]);
    setNewPost({ title: "", prompt: "", model: "", goal: "", tags: "" });
  };

  const handleVote = (postId, voteType) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return { ...post, [voteType]: post[voteType] + 1 };
        }
        return post;
      }),
    );
  };

  const handleAddComment = (postId, comment) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [
              ...post.comments,
              { id: Date.now(), userId: currentUser.id, content: comment },
            ],
          };
        }
        return post;
      }),
    );
  };

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.model.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedTags.length === 0 ||
        selectedTags.every((tag) => post.tags.includes(tag))),
  );

  const allTags = [...new Set(posts.flatMap((post) => post.tags))];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="container mx-auto p-4">
        <div className="glass-effect rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">PromptOverflow</h1>
            <button
              className="p-2 rounded-full bg-white text-purple-600"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-6 w-6" />
              ) : (
                <Moon className="h-6 w-6" />
              )}
            </button>
          </div>
          <div className="bg-white bg-opacity-20 text-white p-4 rounded-lg mb-4">
            <AlertCircle className="h-5 w-5 inline mr-2" />
            <span className="font-bold">Welcome to PromptOverflow!</span>
            <p>
              Share, get feedback, and troubleshoot your AI prompts with the
              community.
            </p>
          </div>
          <div className="mb-4 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearch}
              className="p-2 rounded-lg w-full mr-2 bg-white bg-opacity-20 text-white placeholder-gray-300"
            />
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="p-2 bg-white text-purple-600 rounded-lg font-bold"
              >
                <LogOut className="h-5 w-5 inline mr-2" /> Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="p-2 bg-white text-purple-600 rounded-lg font-bold"
              >
                <LogIn className="h-5 w-5 inline mr-2" /> Login
              </button>
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-white">
              Filter by Tags:
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagSelect(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? "bg-white text-purple-600"
                      : "bg-purple-600 text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          {currentUser && (
            <div className="mb-4 p-4 rounded-lg bg-white bg-opacity-20">
              <h2 className="text-xl font-semibold mb-2 text-white">
                Create New Post
              </h2>
              <input
                name="title"
                placeholder="Title"
                value={newPost.title}
                onChange={handleNewPostChange}
                className="w-full p-2 mb-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
              />
              <textarea
                name="prompt"
                placeholder="Your prompt"
                value={newPost.prompt}
                onChange={handleNewPostChange}
                className="w-full p-2 mb-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
              />
              <input
                name="model"
                placeholder="AI model used"
                value={newPost.model}
                onChange={handleNewPostChange}
                className="w-full p-2 mb-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
              />
              <textarea
                name="goal"
                placeholder="What are you trying to achieve?"
                value={newPost.goal}
                onChange={handleNewPostChange}
                className="w-full p-2 mb-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
              />
              <input
                name="tags"
                placeholder="Tags (comma-separated)"
                value={newPost.tags}
                onChange={handleNewPostChange}
                className="w-full p-2 mb-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
              />
              <button
                onClick={handleNewPostSubmit}
                className="w-full p-2 bg-white text-purple-600 rounded font-bold"
              >
                Create Post
              </button>
            </div>
          )}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-lg bg-white bg-opacity-20 text-white"
              >
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-300">
                  Model: {post.model} | Posted by:{" "}
                  {users.find((u) => u.id === post.userId)?.username ||
                    "Unknown"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-600 text-white rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="font-medium mt-2">Prompt:</p>
                <p className="mb-2">{post.prompt}</p>
                <p className="font-medium">Goal:</p>
                <p>{post.goal}</p>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Comments:</h3>
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-white bg-opacity-10 p-2 rounded mb-2"
                    >
                      <p className="text-sm font-medium">
                        {users.find((u) => u.id === comment.userId)?.username ||
                          "Unknown"}
                        :
                      </p>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                  {currentUser && (
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full p-2 rounded bg-white bg-opacity-20 text-white placeholder-gray-300"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment(post.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between mt-4">
                  <div>
                    <button
                      onClick={() => handleVote(post.id, "likes")}
                      className="p-2 bg-white text-purple-600 rounded mr-2"
                    >
                      <ThumbsUp className="h-4 w-4 inline mr-2" />
                      {post.likes} Likes
                    </button>
                    <button
                      onClick={() => handleVote(post.id, "dislikes")}
                      className="p-2 bg-white text-purple-600 rounded"
                    >
                      <ThumbsDown className="h-4 w-4 inline mr-2" />
                      {post.dislikes} Dislikes
                    </button>
                  </div>
                  <button className="p-2 bg-white text-purple-600 rounded">
                    <MessageSquare className="h-4 w-4 inline mr-2" />
                    {post.comments.length} Comments
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptOverflowApp;
