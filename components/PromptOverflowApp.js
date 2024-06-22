import React, { useState } from "react";
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

// Mock data
const initialPosts = [
  {
    id: 1,
    title: "Help with GPT-4 summarization prompt",
    prompt: "Summarize this text in 3 bullet points:",
    model: "GPT-4",
    output: "• Point 1\n• Point 2\n• Point 3",
    goal: "I want more detailed bullet points",
    likes: 5,
    dislikes: 1,
    comments: [
      {
        id: 1,
        userId: 1,
        content: "Have you tried specifying the desired length for each point?",
      },
      {
        id: 2,
        userId: 2,
        content:
          "You could also ask for specific aspects to be covered in each point.",
      },
    ],
    tags: ["summarization", "GPT-4"],
    userId: 1,
  },
  {
    id: 2,
    title: "DALL-E 3 prompt refinement",
    prompt: "A futuristic cityscape with flying cars",
    model: "DALL-E 3",
    output: "Image description placeholder",
    goal: "I want more neon and cyberpunk elements",
    likes: 10,
    dislikes: 2,
    comments: [
      {
        id: 3,
        userId: 3,
        content:
          "Try adding 'neon-lit' and 'cyberpunk aesthetic' to your prompt.",
      },
    ],
    tags: ["image-generation", "DALL-E", "cyberpunk"],
    userId: 2,
  },
];

const initialUsers = [
  { id: 1, username: "prompt_master", reputation: 120 },
  { id: 2, username: "ai_enthusiast", reputation: 85 },
  { id: 3, username: "newbie_prompter", reputation: 10 },
];

const PromptOverflowApp = () => {
  const { theme, setTheme } = useTheme();
  const [posts, setPosts] = useState(initialPosts);
  const [users] = useState(initialUsers);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLogin = (userId) => {
    setCurrentUser(users.find((user) => user.id === userId));
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleNewPostChange = (event) => {
    setNewPost({ ...newPost, [event.target.name]: event.target.value });
  };

  const handleNewPostSubmit = () => {
    const newPostWithId = {
      ...newPost,
      id: posts.length + 1,
      likes: 0,
      dislikes: 0,
      comments: [],
      tags: newPost.tags.split(",").map((tag) => tag.trim()),
      userId: currentUser.id,
    };
    setPosts([...posts, newPostWithId]);
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
              {
                id: post.comments.length + 1,
                userId: currentUser.id,
                content: comment,
              },
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
    <div className="container mx-auto p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">PromptOverflow</h1>
        <button
          className="p-2 rounded-full bg-primary text-primary-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </button>
      </div>
      <div className="bg-accent text-accent-foreground p-4 rounded-lg mb-4">
        <AlertCircle className="h-4 w-4 inline mr-2" />
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
          className="p-2 border rounded-lg w-full mr-2 bg-background text-foreground"
        />
        {currentUser ? (
          <button
            onClick={handleLogout}
            className="p-2 bg-secondary text-secondary-foreground rounded-lg"
          >
            <LogOut className="h-4 w-4 inline mr-2" /> Logout
          </button>
        ) : (
          <button
            onClick={() => handleLogin(1)}
            className="p-2 bg-primary text-primary-foreground rounded-lg"
          >
            <LogIn className="h-4 w-4 inline mr-2" /> Login
          </button>
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Filter by Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`px-2 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {currentUser && (
        <div className="mb-4 p-4 border rounded-lg bg-card text-card-foreground">
          <h2 className="text-xl font-semibold mb-2">Create New Post</h2>
          <input
            name="title"
            placeholder="Title"
            value={newPost.title}
            onChange={handleNewPostChange}
            className="w-full p-2 mb-2 border rounded bg-input text-foreground"
          />
          <textarea
            name="prompt"
            placeholder="Your prompt"
            value={newPost.prompt}
            onChange={handleNewPostChange}
            className="w-full p-2 mb-2 border rounded bg-input text-foreground"
          />
          <input
            name="model"
            placeholder="AI model used"
            value={newPost.model}
            onChange={handleNewPostChange}
            className="w-full p-2 mb-2 border rounded bg-input text-foreground"
          />
          <textarea
            name="goal"
            placeholder="What are you trying to achieve?"
            value={newPost.goal}
            onChange={handleNewPostChange}
            className="w-full p-2 mb-2 border rounded bg-input text-foreground"
          />
          <input
            name="tags"
            placeholder="Tags (comma-separated)"
            value={newPost.tags}
            onChange={handleNewPostChange}
            className="w-full p-2 mb-2 border rounded bg-input text-foreground"
          />
          <button
            onClick={handleNewPostSubmit}
            className="w-full p-2 bg-primary text-primary-foreground rounded"
          >
            Create Post
          </button>
        </div>
      )}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 border rounded-lg bg-card text-card-foreground"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-muted-foreground">
              Model: {post.model} | Posted by:{" "}
              {users.find((u) => u.id === post.userId).username}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="font-medium mt-2">Prompt:</p>
            <p className="mb-2">{post.prompt}</p>
            <p className="font-medium">Output:</p>
            <p className="mb-2">{post.output}</p>
            <p className="font-medium">Goal:</p>
            <p>{post.goal}</p>
            <div className="mt-4">
              <h3 className="font-medium mb-2">Comments:</h3>
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-muted text-muted-foreground p-2 rounded mb-2"
                >
                  <p className="text-sm font-medium">
                    {users.find((u) => u.id === comment.userId).username}:
                  </p>
                  <p>{comment.content}</p>
                </div>
              ))}
              {currentUser && (
                <textarea
                  placeholder="Add a comment..."
                  className="w-full p-2 border rounded bg-input text-foreground"
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
                  className="p-2 bg-secondary text-secondary-foreground rounded mr-2"
                >
                  <ThumbsUp className="h-4 w-4 inline mr-2" />
                  {post.likes} Likes
                </button>
                <button
                  onClick={() => handleVote(post.id, "dislikes")}
                  className="p-2 bg-secondary text-secondary-foreground rounded"
                >
                  <ThumbsDown className="h-4 w-4 inline mr-2" />
                  {post.dislikes} Dislikes
                </button>
              </div>
              <button className="p-2 bg-secondary text-secondary-foreground rounded">
                <MessageSquare className="h-4 w-4 inline mr-2" />
                {post.comments.length} Comments
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptOverflowApp;
