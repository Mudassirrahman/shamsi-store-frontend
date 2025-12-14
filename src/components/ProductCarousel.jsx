import { Carousel } from "primereact/carousel";

const ProductCarousel = ({ products }) => {
  const itemTemplate = (item) => (
    <div className="w-full h-full relative mt-4">
      <img
        src={`data:image/jpeg;base64,${item.imageBase64}`}
        alt={item.name}
        className="w-full h-full object-cover border-round"
        style={{ maxHeight: "450px" }}
      />
      <div
        className="absolute bottom-0 left-0 w-full p-4 text-white"
        style={{
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
        }}
      >
        <h2 className="m-0">{item.name}</h2>
        <p className="m-0 font-bold">${item.price}</p>
      </div>
    </div>
  );

  return (
    <div
      className="w-full shadow-3 border-round mb-5"
      style={{ marginTop: "4rem" }}
    >
      <Carousel
        value={products.slice(0, 4)}
        numVisible={1}
        numScroll={1}
        itemTemplate={itemTemplate}
        circular
        autoplayInterval={4000}
        showIndicators
        showNavigators
        className="w-full"
      />
    </div>
  );
};

export default ProductCarousel;
