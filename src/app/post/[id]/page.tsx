interface PostProps {
  params: {
    id?: string;
  };
}

const Post = ({ params }: PostProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {params.id ? <h1>{params.id}</h1> : <h1>No Post ID provided</h1>}
    </div>
  );
};

export default Post;
