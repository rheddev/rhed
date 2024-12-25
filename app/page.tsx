export default function Home() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="w-1/2 aspect-video">
        <iframe
          src="https://player.twitch.tv/?channel=RhedDev&parent=rhed.rhamzthev.com&parent=localhost"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}