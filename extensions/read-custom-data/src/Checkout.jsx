// [START read-custom-data.imports]
import { useEffect, useState } from "react";
import {
  useCartLineTarget,
  Text,
  useAppMetafields,
} from "@shopify/ui-extensions-react/checkout";
// [END read-custom-data.imports]

// [START read-custom-data.ext-point]
// Set the entry points for the extension
export default reactExtension("purchase.checkout.cart-line-item.render-after", () => <App />);
// [END read-custom-data.ext-point]

function App() {
  // [START read-custom-data.use-metafields]
  // Use the merchant-defined metafield for watering instructions and map it to a cart line
  const wateringMetafields = useAppMetafields({
    type: "product",
    namespace: "instructions",
    key: "watering"
  });
  const cartLineTarget = useCartLineTarget();

  const [wateringInstructions, setWateringInstructions] = useState("");

  useEffect(() => {
    // Get the product ID from the cart line item
    const productId = cartLineTarget?.merchandise?.product?.id;
    if (!productId) {
      return;
    }

    const wateringMetafield = wateringMetafields.find(({target}) => {
      // Check if the target of the metafield is the product from our cart line
      return `gid://shopify/Product/${target.id}` === productId;
    });

    // If we find the metafield, set the watering instructions for this cart line
    if (typeof wateringMetafield?.metafield?.value === "string") {
      setWateringInstructions(wateringMetafield.metafield.value);
    }
  }, [cartLineTarget, wateringMetafields]);
  // [END read-custom-data.use-metafields]

  // [START read-custom-data.render]
  // Render the watering instructions if applicable
  if (wateringInstructions) {
    return (
        <Text>
          {wateringInstructions}
        </Text>
      );
  }

  return null;
  // [END read-custom-data.render]
}
