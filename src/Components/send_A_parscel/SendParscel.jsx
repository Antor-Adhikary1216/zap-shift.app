import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router";
import Swal from "sweetalert2";
import UseaxiosSecure from "../../Hooks/useAxios/useaxiosSecure";
import useAuth from "../../Hooks/useAuth/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const SendParscel = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      parceltype: "document",
      receiverrwatch: "",
      receiverDestricts: "",
      senderwatch: "",
      senderDestricts: "",
    },
  });

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const axiosSecure = UseaxiosSecure();
    const navigete = useNavigate()

  const senter = useLoaderData();
  const regionsDuplicate = senter.map((reson) => reson.region);
  const regios = [...new Set(regionsDuplicate)];
  const senderwatch = useWatch({ control, name: "senderwatch" });
  const receiverrwatch = useWatch({ control, name: "receiverrwatch" });
  const parceltype = useWatch({ control, name: "parceltype" });
  const isDocument = parceltype === "document";

  const districtsByregions = (region) => {
    const distrctsregions = senter.filter((c) => c.region === region);
    const districts = distrctsregions.map((d) => d.district);
    return districts;
  };



  // {
  //     "parceltype": "document",
  //     "parcelName": "",
  //     "parcelWeight": "",
  //     " sender Name": "",
  //     "sender address": "",
  //     " senderNo": "",
  //     "receiverrwatch": "West Bengal",
  //     "receiverDestricts": "Howrah",
  //     "senderpickup Address": "",
  //     "sender instruction": "",
  //     "receiverName": "",
  //     "receiveraddress": "",
  //     "receiver Contect": "",
  //     "senderwatch": "West Bengal",
  //     "senderDestricts": "Howrah",
  //     "delibery Address": "",
  //     "Delibery instruction": ""
  // }
  const handlesendParcel = (data) => {
    console.log(data);

    const Isdocument = data.parceltype === "document";
    const parcelweitght = parseFloat(data.parcelWeight);
    const Issamedistrict = data.receiverDestricts === data.senderDestricts;
    let cost;
    if (Isdocument) {
      cost = Issamedistrict ? 69 : 99;
    } else {
      if (parcelweitght < 3) {
        cost = Issamedistrict ? 119 : 149;
      } else {
        const minCharge = Issamedistrict ? 119 : 149;
        const extraWeight = parcelweitght - 3;
        const extraCharge = Issamedistrict
          ? extraWeight * 40
          : extraWeight * 40 + 20;
        cost = minCharge + extraCharge;
      }
    }
    console.log("cost", cost);
    data.cost = cost;
    // Sweet Alert Info------------------------------->
    Swal.fire({
      title: "Are you agree with  price?",
      text: ` You have to pay ${cost} Rupe!💸  `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, take it my parcel!",
    }).then((result) => {
      if (result.isConfirmed)
        // seve the parcel database
        axiosSecure.post("/parcels", data).then((res) => {

          if(res.data.insertedId){
            queryClient.invalidateQueries({ queryKey: ["my-parcels", user?.email] })
            navigete("/dashbord/my-parcels")
            Swal.fire({
        title: "Conform !",
        text: "Your parcel has been conform now please pay your parcel cost .",
        icon: "success",
        
        
      });
          }
          console.log("After seveing parcel", res.data);
        })

      
    });
  };

  return (
    <div>
      <div className="mt-5 mb-10 rounded-xl bg-white p-4 shadow-md sm:p-6 lg:p-10">
        <h1 className="text-3xl font-bold sm:text-[45px]">Send A Parcel</h1>
        <p className="font-bold text-[20px] my-4">Enter your parcel details</p>
        <div className="border-b border-[#000000]"></div>

        <form onSubmit={handleSubmit(handlesendParcel)}>
          <div className="flex flex-wrap gap-5 sm:gap-10">
            <div className="mt-3 flex gap-0.5 text-center">
              <input
                type="radio"
                {...register("parceltype")}
                value="document"
                className="radio text-green-500"
              />
              <p>Document <span className="text-red-500">*</span></p>
            </div>
            <div className="mt-3 flex gap-0.5 text-center">
              <input
                type="radio"
                {...register("parceltype")}
                value="none-documet"
                className="radio text-green-500"
              />
              <p>Non-Document <span className="text-red-500">*</span></p>
            </div>
          </div>
          {/* input */}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10">
            <div className="min-w-0">
              <p className="my-1">Parcel Name <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register("parcelName", { required: true })}
                placeholder="Parcel Name"
                className={`w-full rounded-md border bg-white p-2 ${errors.parcelName ? "border-red-500" : ""}`}
              />
            </div>
            <div className="min-w-0">
              <p className="my-1">
                Parcel Weight (KG) {!isDocument && <span className="text-red-500">*</span>}
              </p>
              <input
                type="number"
                min="0.1"
                step="0.1"
                disabled={isDocument}
                {...register("parcelWeight", {
                  required: !isDocument,
                  min: isDocument ? undefined : 0.1,
                })}
                placeholder={isDocument ? "Not required for documents" : "Parcel Weight (KG)"}
                className={`w-full rounded-md border bg-white p-2 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 ${errors.parcelWeight ? "border-red-500" : ""}`}
              />
            </div>
          </div>

          <div className="mx-auto my-8 w-full border-b border-[#000000] lg:my-10"></div>
          {/*  sendder------------------------------------------------ -> */}
          <div className="mt-10 grid gap-8 lg:mt-16 lg:grid-cols-2">
            <div className="min-w-0">
              <h1 className="text-[20px] font-medium ">Sender Details</h1>
              <p>Sender Name <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register(" sender Name", { required: true })}
                defaultValue={user?.displayName}
                placeholder="Sender Name"
                className="rounded-md w-full border p-2"
              />
              <p>Email Address <span className="text-red-500">*</span></p>
              <input
                type="email"
                placeholder="Email Address"
                {...register("senderemail", { required: true })}
                defaultValue={user?.email}
                className="rounded-md w-full border p-2"
              />
              <p>Sender Phone No <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register(" senderNo", { required: true })}
                placeholder="Sender Phone No"
                className="rounded-md w-full border p-2"
              />

              {/* sender--------------------------------------------------------------------------------  */}
              {/*  pic a regoin -> */}
              <p>Your Region <span className="text-red-500">*</span></p>
              <select
                {...register("receiverrwatch", { required: true })}
                className="select select-accent w-full"
              >
                <option value="" disabled>Select your location</option>
                {regios.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/* dectricts */}
              <p>Your District <span className="text-red-500">*</span></p>
              <select
                {...register("receiverDestricts", { required: true })}
                className="select select-accent w-full"
              >
                <option value="" disabled>Select your location</option>
                {districtsByregions(receiverrwatch).map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/*Address =>-------------------------- receiver  */}
              <p>Pickup Address <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register("senderpickup Address", { required: true })}
                placeholder="Pickup Address "
                className="rounded-md w-full border p-2"
              />

              {/* reinstruction  */}
              <p>pickup Instruction</p>
              <input
                type="text"
                {...register("sender instruction")}
                placeholder="Delivery Instruction "
                className="rounded-md w-full border p-2"
              />
              <p className="mt-15">* PickUp Time 4pm-7pm Approx.</p>

              {Object.keys(errors).length > 0 && (
                <p className="mt-4 text-sm font-semibold text-red-600" role="alert">
                  Please complete all required fields marked with *.
                </p>
              )}

              <input
                type="submit"
                value="send parcel"
                className="btn mt-5 w-full bg-amber-400 px-6 text-lg font-bold sm:w-auto sm:px-10"
              />
            </div>

            {/* Receiver Details------------------------------------------------ */}
            <div className="min-w-0">
              <h1 className="text-[20px] font-medium ">Receiver Details</h1>
              <p>Receiver Name <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register("receiverName", { required: true })}
                placeholder="Receiver Name"
                className="rounded-md w-full border p-2"
              />
              <p>Receiver Email Address <span className="text-red-500">*</span></p>
              <input
                type="email"
                {...register("receiver email address", { required: true })}
                placeholder="Email Address"
                className="rounded-md w-full border p-2"
              />
              <p>Receiver Contact No <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register("receiver Contect", { required: true })}
                placeholder="Receiver No"
                className="rounded-md w-full border p-2"
              />
              {/*  pic a regoin----------------------------------------- -> */}
              <p>Receiver Region <span className="text-red-500">*</span></p>
              <select
                {...register("senderwatch", { required: true })}
                className="select select-accent w-full"
              >
                <option value="" disabled>Select your location</option>
                {regios.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/* dectricts--------------------------------------- */}
              <p>Receiver District <span className="text-red-500">*</span></p>
              <select
                {...register("senderDestricts", { required: true })}
                className="select select-accent w-full"
              >
                <option value="" disabled>Select your location</option>
                {districtsByregions(senderwatch).map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <p>Delivery Address <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register("delibery Address", { required: true })}
                placeholder="Delivery Address "
                className="rounded-md w-full border p-2"
              />
              <p>Delivery Instruction</p>
              <input
                type="text"
                {...register("Delibery instruction")}
                placeholder="Delivery Instruction "
                className="rounded-md w-full border p-2"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendParscel;
