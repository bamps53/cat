import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";

// getServerSidePropsから渡されるpropsの型
type Props = {
  initialImageUrl: string;
};
// ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props> = ({ initialImageUrl }) => {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [loading, setLoading] = useState(false);
  //   useEffect(() => {
  //     featchImage().then((image) => {
  //       setImageUrl(image.url);
  //       setLoading(false);
  //     });
  //   }, []);
  const handleClick = async () => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  };
  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>
        他のにゃんこも見る
      </button>
      <div className={styles.frame}>
        {loading || <img src={imageUrl} className={styles.img} />}
      </div>
    </div>
  );
};
export default IndexPage;
// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};
type Image = {
  url: string;
};
const fetchImage = async (): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images: unknown = await res.json();
  if (!Array.isArray(images)) throw new Error("Failed to fetch API");
  const image: unknown = images[0];
  if (!isImage(image)) throw new Error("Failed to fetch API");
  console.log(image);
  return image;
};

const isImage = (image: unknown): image is Image => {
  if (!image || typeof image !== "object") return false;
  return "url" in image && typeof image.url === "string";
};

fetchImage();
