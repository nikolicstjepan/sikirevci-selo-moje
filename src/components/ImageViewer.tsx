import dynamic from "next/dynamic";

const Viewer = dynamic(() => import("react-viewer"), { ssr: false });

type ImageViewerProps = {
  visible: boolean;
  onClose: () => void;
  src: string;
  alt: string;
};

export default function ImageViewer({ visible, onClose, src, alt }: ImageViewerProps) {
  return (
    <Viewer
      visible={visible}
      onClose={onClose}
      images={[{ src, alt }]}
      changeable={false}
      scalable={false}
      rotatable={false}
      noNavbar
      noImgDetails
      showTotal={false}
    />
  );
}
