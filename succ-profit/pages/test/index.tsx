export const getServerSideProps = async function getServerSideProps() {
  //   const emergencyRelation = await ServerApiService.post(
  //     `${CONSIGN_UISETTING}/emergencyRelation`
  //   );
  const res = await fetch("http://localhost:3000/api/yahoo");
  const data = await res.json();
  console.log('cc', data);
  
  return {
    props: {
      //   emergencyRelation: emergencyRelation,
    },
  };
};

function Page() {
  return (
    <>
      <h1>Test</h1>
      <table></table>
    </>
  );
}

export default Page;
