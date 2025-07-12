import ChecksList from "@/components/ChecksList";
import { archiveCheck } from "./API/archiveCheck";

export const ActiveChecks = () => {
    return (
        <ChecksList
            endpoint="http://localhost:8000/getCheckList"
            mode="active"
            onArchiveToggle={archiveCheck}
        />
    )
}