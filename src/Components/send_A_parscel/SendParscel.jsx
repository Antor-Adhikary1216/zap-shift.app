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
  const handlesendParcel = async (data) => {
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
    data.cost = cost;
    // Sweet Alert Info------------------------------->
    const confirmation = await Swal.fire({
      title: "Are you agree with  price?",
      text: ` You have to pay ${cost} Rupe!💸  `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, take it my parcel!",
    });

    if (!confirmation.isConfirmed) return;

    try {
      const res = await axiosSecure.post("/parcels", data);

      if (res.data.insertedId) {
        await queryClient.invalidateQueries({ queryKey: ["my-parcels", user?.email] });
        navigete("/dashbord/my-parcels");
        Swal.fire({
          title: "Confirmed!",
          text: "Your parcel has been saved. You can now pay the delivery cost.",
          icon: "success",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Unable to save parcel",
        text: error.response?.data?.message || "Please try again in a moment.",
        icon: "error",
      });
    }
  };

  const fieldLabelClass = "mb-2 mt-4 block text-sm font-semibold text-[#303030]";
  const inputClass = "h-12 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 text-base outline-none transition focus:border-[#9fc22e] focus:ring-2 focus:ring-[#caeb66]/35";
  const selectClass = "select h-12 w-full min-w-0 rounded-lg border-slate-300 bg-white text-base focus:border-[#9fc22e] focus:outline-none";

  return (
    <div className="min-w-0">
      <div className="mx-auto mb-10 mt-4 w-full max-w-[1200px] min-w-0 rounded-xl bg-white p-4 shadow-md sm:mt-5 sm:p-6 lg:p-10">
        <h1 className="text-3xl font-bold leading-tight sm:text-[45px]">Send A Parcel</h1>
        <p className="my-3 text-lg font-bold sm:my-4 sm:text-xl">Enter your parcel details</p>
        <div className="border-b border-[#000000]"></div>

        <form onSubmit={handleSubmit(handlesendParcel)} className="min-w-0">
          <div className="flex flex-wrap gap-x-5 gap-y-2 sm:gap-x-10">
            <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-2">
              <input
                type="radio"
                {...register("parceltype")}
                value="document"
                className="radio size-5 shrink-0 text-green-500"
              />
              <span>Document <span className="text-red-500">*</span></span>
            </label>
            <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-2">
              <input
                type="radio"
                {...register("parceltype")}
                value="none-documet"
                className="radio size-5 shrink-0 text-green-500"
              />
              <span>Non-Document <span className="text-red-500">*</span></span>
            </label>
          </div>
          {/* input */}

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:mt-8">
            <div className="min-w-0">
              <p className="mb-2 text-sm font-semibold">Parcel Name <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register("parcelName", { required: true })}
                placeholder="Parcel Name"
                className={`${inputClass} ${errors.parcelName ? "border-red-500" : ""}`}
              />
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-sm font-semibold">
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
                className={`${inputClass} disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 ${errors.parcelWeight ? "border-red-500" : ""}`}
              />
            </div>
          </div>

          <div className="mx-auto my-8 w-full border-b border-[#000000] lg:my-10"></div>
          {/*  sendder------------------------------------------------ -> */}
          <div className="mt-8 grid min-w-0 gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-12">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">Sender Details</h2>
              <p className={fieldLabelClass}>Sender Name <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register(" sender Name", { required: true })}
                defaultValue={user?.displayName}
                placeholder="Sender Name"
                className={inputClass}
              />
              <p className={fieldLabelClass}>Email Address <span className="text-red-500">*</span></p>
              <input
                type="email"
                placeholder="Email Address"
                {...register("senderemail", {
                  required: true,
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                })}
                defaultValue={user?.email}
                className={`${inputClass} ${errors.senderemail ? "border-red-500" : ""}`}
              />
              {errors.senderemail && <p className="text-sm font-medium text-red-600">Please provide a valid sender email address.</p>}
              <p className={fieldLabelClass}>Sender Phone No <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register(" senderNo", { required: true })}
                placeholder="Sender Phone No"
                className={inputClass}
              />

              {/* sender--------------------------------------------------------------------------------  */}
              {/*  pic a regoin -> */}
              <p className={fieldLabelClass}>Your Region <span className="text-red-500">*</span></p>
              <select
                {...register("receiverrwatch", { required: true })}
                className={selectClass}
              >
                <option value="" disabled>Select your location</option>
                {regios.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/* dectricts */}
              <p className={fieldLabelClass}>Your District <span className="text-red-500">*</span></p>
              <select
                {...register("receiverDestricts", { required: true })}
                className={selectClass}
              >
                <option value="" disabled>Select your location</option>
                {districtsByregions(receiverrwatch).map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/*Address =>-------------------------- receiver  */}
              <p className={fieldLabelClass}>Pickup Address <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register("senderpickup Address", { required: true })}
                placeholder="Pickup Address "
                className={inputClass}
              />

              {/* reinstruction  */}
              <p className={fieldLabelClass}>Pickup Instruction</p>
              <input
                type="text"
                {...register("sender instruction")}
                placeholder="Delivery Instruction "
                className={inputClass}
              />
              <p className="mt-5 text-sm text-[#606060]">* PickUp Time 4pm-7pm Approx.</p>
            </div>

            {/* Receiver Details------------------------------------------------ */}
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">Receiver Details</h2>
              <p className={fieldLabelClass}>Receiver Name <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register("receiverName", { required: true })}
                placeholder="Receiver Name"
                className={inputClass}
              />
              <p className={fieldLabelClass}>Receiver Email Address <span className="text-red-500">*</span></p>
              <input
                type="email"
                {...register("receiver email address", { required: true })}
                placeholder="Email Address"
                className={inputClass}
              />
              <p className={fieldLabelClass}>Receiver Contact No <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register("receiver Contect", { required: true })}
                placeholder="Receiver No"
                className={inputClass}
              />
              {/*  pic a regoin----------------------------------------- -> */}
              <p className={fieldLabelClass}>Receiver Region <span className="text-red-500">*</span></p>
              <select
                {...register("senderwatch", { required: true })}
                className={selectClass}
              >
                <option value="" disabled>Select your location</option>
                {regios.map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              {/* dectricts--------------------------------------- */}
              <p className={fieldLabelClass}>Receiver District <span className="text-red-500">*</span></p>
              <select
                {...register("senderDestricts", { required: true })}
                className={selectClass}
              >
                <option value="" disabled>Select your location</option>
                {districtsByregions(senderwatch).map((r, i) => (
                  <option key={i} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <p className={fieldLabelClass}>Delivery Address <span className="text-red-500">*</span></p>
              <input
                type="text"
                {...register("delibery Address", { required: true })}
                placeholder="Delivery Address "
                className={inputClass}
              />
              <p className={fieldLabelClass}>Delivery Instruction</p>
              <input
                type="text"
                {...register("Delibery instruction")}
                placeholder="Delivery Instruction "
                className={inputClass}
              />
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <p className="mt-6 text-sm font-semibold text-red-600" role="alert">
              Please complete all required fields marked with *.
            </p>
          )}

          <input
            type="submit"
            value="Send parcel"
            className="btn mt-6 min-h-12 w-full bg-amber-400 px-6 text-base font-bold sm:w-auto sm:px-10 sm:text-lg"
          />
        </form>
      </div>
    </div>
  );
};

export default SendParscel;
