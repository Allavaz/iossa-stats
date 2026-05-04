import Title from "../../../components/ui/title";

export default function Vod({ vod }: { vod?: string }) {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center gap-x-2">
        <Title style={{ display: "inline", width: "fit-content" }}>
          VIDEO DEL PARTIDO
        </Title>
      </div>
      <iframe
        title="vod"
        className="aspect-video w-full"
        src={"https://www.youtube.com/embed/" + vod}
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
