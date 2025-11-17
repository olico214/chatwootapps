import GptComponent from "./components/gptComponent";

export default async function GptPage({ params }) {

    const { id } = await params;
    return (
        <div className="mx-auto container p-5 grid">
            <GptComponent id={id} />
        </div>
    )
}