import ChecksList from "@/components/ChecksList";

export const ActiveChecks = () => {
    return (
        <ChecksList
            endpoint="http://217.199.252.124:8080/api/getCheckList"
            mode="active"
        />
    )
}