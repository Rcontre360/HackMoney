import {useEffect, useState} from "react";
import clsx from "clsx";
// import {createTandaDAO} from "../../helpers/quicklend";
import "./index.module.scss";

const Step1 = ({ selectOrgType, selectStep }) => {
  const selectOpt = (opt) => {
    selectOrgType(opt);
    selectStep(1);
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full">
      <button
        onClick={() => {
          selectOpt("new");
        }}
        className="btn bg-primary flex flex-col items-center h-[100px]"
      >
        <p className="text-white text-xl">Create an organization</p>
        <p className="text-white text-xl">
          Start your organization with Aragon
        </p>
      </button>
      <button
        onClick={() => {
          selectOpt("existing");
        }}
        className="btn bg-primary flex flex-col items-center"
      >
        <p className="text-white">Open an existing organization</p>
      </button>
    </div>
  );
};

const Step2 = ({ orgName, selectOrgName, selectStep }) => {
  const handleChange = (event) => {
    selectOrgName(event.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col">
        <form className="flex flex-col items-center w-full mb-5">
          <label className="text-white">NAME OF ORGANIZATION</label>
          <input
            type="text"
            value={orgName}
            onChange={handleChange}
            placeholder="Type here"
            className="input input-bordered input-success w-full max-w-xs"
          />
        </form>

        <div className="flex flex-row justify-evenly gap-4">
          <button
            className="btn bg-primary text-white"
            onClick={() => {
              selectStep(0);
            }}
          >
            Back
          </button>

          <button
            className="btn bg-primary text-white"
            onClick={() => {
              selectStep(2);
            }}
          >
            Open Organization
          </button>
        </div>
      </div>
    </div>
  );
};

const Step3 = ({ orgTemplate, selectOrgTemplate, selectStep }) => {
  const buttons = [
    { title: "Company", value: "company" },
    { title: "Membership", value: "membership" },
    { title: "Reputation", value: "reputation" },
    { title: "Dandelion", value: "dandelion" },
    { title: "Open Enterprise", value: "enterprice" },
    { title: "Fundraising", value: "fundraising" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center">
        <h3 className="text-white">TYPE OF ORGANIZATION</h3>
        <div className="grid gap-4 grid-cols-3 grid-rows-2 m-10">
          {buttons.map((k, i) => (
            <button
              key={i}
              onClick={() => {
                selectOrgTemplate(k.value);
              }}
              className={clsx(
                "btn text-white bg-primary",
                orgTemplate === k.value && "bg-secondary"
              )}
            >
              {k.title}
            </button>
          ))}
        </div>

        <div className="flex flex-row justify-evenly gap-4">
          <button
            className="btn btn-warning"
            onClick={() => {
              selectStep(1);
            }}
          >
            <span className="text-white">Back</span>
          </button>

          <button
            className="btn btn-warning"
            onClick={() => {
              selectStep(3);
            }}
          >
            <span className="text-white">Select Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Step4 = ({ setTokenDetails, selectStep }) => {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [support, setSupport] = useState(10);
  const [quorum, setQuorum] = useState(10);
  const [duration, setDuration] = useState(1);
  const [tokenHolders, setTokenHolders] = useState([
    "0xB9602f2442da97651D5f7e0435a4733b1a1145cD",
  ]);

  const fields = [
    { title: "TOKEN NAME", setFn: setTokenName, value: tokenName },
    { title: "TOKEN SYMBOL", setFn: setTokenSymbol, value: tokenSymbol },
    { title: "SUPPORT", setFn: setSupport, value: support },
    { title: "QUORUM", setFn: setQuorum, value: quorum },
    { title: "DURATION", setFn: setDuration, value: duration },
  ];

  const updateTokenHolders = (e, i) => {
    const holders = [...tokenHolders];
    holders[i] = e.target.value;
    setTokenHolders(holders);
  };

  const addMore = () => {
    setTokenHolders([...tokenHolders, ""]);
  };

  useEffect(() => {
    setTokenDetails({
      tokenName,
      tokenSymbol,
      tokenHolders,
      support,
      quorum,
      duration,
    });
  }, [tokenName, tokenSymbol, tokenHolders]);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col gap-4 card w-96 bg-secondary text-primary-content overflow-scroll mb-10">
        <div className="sticky top-0 bg-primary w-full px-10 py-5">
          <h3 className="text-white text-center">
            CHOOSE YOUR TOKENS SETTINGS BELOW
          </h3>

          <div className="flex flex-row justify-evenly mt-5">
            <button
              className="btn btn-warning"
              onClick={() => {
                selectStep(2);
              }}
            >
              <span className="gradient-text">Back</span>
            </button>

            <button
              className="btn btn-warning"
              onClick={() => {
                selectStep(4);
              }}
            >
              <span className="gradient-text">Create DAO</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-10">
          {fields.map((k, i) => (
            <div key={i} className="flex flex-row justify-around">
              <form className="w-full" variant="filled">
                <label className="text-white mb-5">{k.title}</label>
                <input
                  className="input input-bordered input-success w-full max-w-xs text-black"
                  value={k.value}
                  onChange={(e) => {
                    k.setFn(e.target.value);
                  }}
                />
              </form>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
              <p className="text-white">TOKEN HOLDERS</p>
              <button className="btn bg-primary w-24" onClick={addMore}>
                <span className="gradient-text">Add more</span>
              </button>
            </div>
            <form className="flex flex-col gap-4 w-full" variant="filled">
              {tokenHolders.map((k, i) => (
                <input
                  key={i}
                  className="input input-bordered input-success w-full max-w-xs text-black"
                  value={k}
                  onChange={(e) => {
                    updateTokenHolders(e, i);
                  }}
                />
              ))}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const Step5 = ({ setComplete }) => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-full">
      <div>
        <p className="text-white text-center text-2xl">All Done</p>
        <p className="text-white text-center text-2xl">
          Your organization is ready
        </p>
      </div>
      <button
        className="btn bg-primary"
        onClick={() => {
          setComplete(true);
        }}
      >
        <span className="text-white">Get Started</span>
      </button>
    </div>
  );
};

const Borrow = () => {
	const [orgType, selectOrgType] = useState('');
	const [orgName, selectOrgName] = useState('');
	const [orgTemplate, selectOrgTemplate] = useState('company');
	const [tokenDetails, setTokenDetails] = useState({});
	const [step, selectStep] = useState(0);
	const [complete, setComplete] = useState(false);
	const [allDetails, setAllDetails] = useState({});

	const steps = [
		<Step1 selectOrgType={selectOrgType} selectStep={selectStep} />,
		<Step2 orgName={orgName} selectOrgName={selectOrgName} selectStep={selectStep} />,
		<Step3 orgTemplate={orgTemplate} selectOrgTemplate={selectOrgTemplate} selectStep={selectStep} />,
		<Step4 setTokenDetails={setTokenDetails} selectStep={selectStep} />,
		<Step5 setComplete={setComplete} />,
	]

	useEffect(() => {
		if(step === 4) {
			const details = {
				orgName,
				orgType,
				orgTemplate,
				...tokenDetails
			};
			setAllDetails(details);

			// createTandaDAO({
			// 	network: "rinkeby",
			// 	dao: orgName,
			// 	// members: ["0xB9602f2442da97651D5f7e0435a4733b1a1145cD"], //first members
			// 	members: details.tokenHolders,
			// 	support: +details.support, //support in %
			// 	quorum: +details.quorum, //quorum in %
			// 	duration: +details.duration, //duration in hours (of voting)
			// 	// support: 10, //support in %
			// 	// quorum: 10, //quorum in %
			// 	// duration: 1, //duration in hours (of voting)
			// });
		}
	}, [step]);

	useEffect(() => {
		console.log(allDetails);
	}, [complete]);

	return (
		<>
			<div className='w-full mt-10 h-[90vh]'>
				{steps[step]}
			</div>
		</>
	);
};

export default Borrow;
