export default function ReviewPage({ params }: { params: { hid: string } }) {
    return (
      <div>
        <h1>Review for Hotel ID: {params.hid}</h1>
      </div>
    );
  }