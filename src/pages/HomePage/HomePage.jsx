import GoToCatalog from "../../components/GoToCatalog/GoToCatalog";
import ProductList from "../../components/ProductList/ProductList";
import SliderHome from "../../components/SliderHome/SliderHome";



export default function HomePage() {
    return (
        <>
            <SliderHome/>
            <ProductList  limit={3} />
            
        </>
    )
}