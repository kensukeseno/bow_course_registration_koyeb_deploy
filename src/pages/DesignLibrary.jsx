function DesignLibrary() {
  return (
    <div className="flex flex-col gap-3 ">
      <div>
        <button className="btn-primary-fill py-2 px-5">btn-primary-fill</button>
      </div>
      <div>
        <button className="btn-primary-outlined">
          <p className="py-2 px-5">btn-primary-outlined</p>
        </button>
      </div>
      <div>
        <button className="btn-secondary py-2 px-5">btn-secondary</button>
      </div>
      <div>
        <button className="btn-delete py-2 px-5">btn-delete</button>
      </div>
      <div className="bg-1 text-white p-5">bg-1</div>
      <div className="bg-2 text-white p-5">bg-2</div>
      <div className="bg-3 text-white p-5">bg-3</div>
      <div className="bg-4 text-white p-5">bg-4</div>
      <div className="bg-5 text-white p-5">bg-5</div>
    </div>
  );
}

export default DesignLibrary;
