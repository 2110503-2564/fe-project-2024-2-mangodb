import RoomCard from "./RoomCard";

export default function RoomCatalog() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "30px",
        justifyContent: "center",
        padding: "40px",
      }}
    >
      <RoomCard
        pricePerNight="100"
        imgSrc="https://drive.google.com/uc?id=1BKdEV__CFcehgxTv0IM1X6p32hrFE50o"
        location="Bangkok"
        size={50}
        hid="67ddbb362d8aba46b84a6810"
        amoutOfPeople={3}
      />
      <RoomCard
        pricePerNight="150"
        imgSrc="https://drive.google.com/uc?id=18UDfvN4Kd1jonQsQtlsi55FUAkEOjH6R"
        location="Phuket"
        size={65}
        hid="67ddbb362d8aba46b84a6810"
        amoutOfPeople={3}
      />
      <RoomCard
        pricePerNight="120"
        imgSrc="https://drive.google.com/uc?id=1zSVg3cYNZp2UQoOApKXFHTipLIUnSy1c"
        location="Chiangmai"
        size={55}
        hid="67ddbb362d8aba46b84a6810"
        amoutOfPeople={3}
      />
    </div>
  );
}
