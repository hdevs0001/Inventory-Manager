type MainHeadingProps = {
  title: string;
};

function MainHeading({ title }: MainHeadingProps) {
  return (
    <h1 className="text-center mt-3 text-3xl uppercase font-bold font-sans">
      {title}
    </h1>
  );
}

export default MainHeading;
