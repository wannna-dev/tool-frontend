const ComunidadPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return (
        <div>
            <h1>Comunidad {id}</h1>
        </div>
    );
};

export default ComunidadPage;