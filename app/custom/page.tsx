interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const CustomGlowPage = async ({
  searchParams,
}: PageProps) => {
  const { text } = await searchParams;

  return (
    <main className="w-full h-screen flex items-center justify-center">
      <h1 className="font-playwrite text-[15rem] text-glow font-thin">
        {text}
      </h1>
    </main>
  );
};

export default CustomGlowPage;