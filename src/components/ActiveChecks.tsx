import ChecksList from "@/components/ChecksList";
import { CheckedItemsProvider } from "@/context/CheckedItemsContext";

export const ActiveChecks = () => {
    return (
        <CheckedItemsProvider>
            <ChecksList
                mode="active"
            />
        </CheckedItemsProvider>
    )
}