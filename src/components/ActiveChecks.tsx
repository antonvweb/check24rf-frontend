import ChecksList from "@/components/ChecksList";
import { archiveCheck } from "./API/archiveCheck";

export const ActiveChecks = () => {
    return (
        <ChecksList
            endpoint="http://217.199.252.124:8080/getCheckList"
            mode="active"
            onArchiveToggle={archiveCheck}
        />
    )
}