"use client";

import { AutoCompleteInput } from "@/components/onboarding/autocomplete-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthContext } from "@/context/auth-context";
import discomData from "@/data/electricity-providers.json";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ChevronLeft, ChevronRight, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ApplianceDetail {
  type: string;
  quantity: number;
  averageUsage: number;
  wattCapacity: number;
  usagePattern: string;
  energyEfficiencyRating: string;
}

interface ApplianceUsage {
  hvac: boolean;
  largeAppliances: number;
  batteryStorage: boolean;
  storageCapacity: number;
  applianceDetails: ApplianceDetail[];
}

interface RoofCharacteristics {
  hasSolarPanels: boolean;
  roofArea: string;
  roofDirection: string;
  sunlightHours: string;
  solarCapacity: string;
}

interface TimeOfDayPreferences {
  preferredTiming: string;
  solarBatteryUsage: boolean;
  flexibility: string;
}

interface ForecastCustomization {
  expectedUsage: number;
}

interface NotificationSetup {
  highTariffAlerts: boolean;
  extremeWeatherAlerts: boolean;
}

interface FinancialData {
  gridProvider: string;
  monthlyEnergyBill: number;
  investmentInSolar: number;
}

interface FormData {
  primaryGoal: string;
  energyAwareness: string;
  roofCharacteristics: RoofCharacteristics;
  applianceUsage: ApplianceUsage;
  smartDevices: string[];
  timeOfDayPreferences: TimeOfDayPreferences;
  forecastCustomization: ForecastCustomization;
  notificationSetup: NotificationSetup;
  financialData: FinancialData;
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [discoms, setDiscoms] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    primaryGoal: "",
    energyAwareness: "",
    roofCharacteristics: {
      hasSolarPanels: false,
      roofArea: "",
      roofDirection: "",
      sunlightHours: "",
      solarCapacity: "",
    },
    applianceUsage: {
      hvac: false,
      largeAppliances: 0,
      batteryStorage: false,
      storageCapacity: 0,
      applianceDetails: [],
    },
    smartDevices: [],
    timeOfDayPreferences: {
      preferredTiming: "",
      solarBatteryUsage: false,
      flexibility: "",
    },
    forecastCustomization: {
      expectedUsage: 0,
    },
    notificationSetup: {
      highTariffAlerts: false,
      extremeWeatherAlerts: false,
    },
    financialData: {
      gridProvider: "",
      monthlyEnergyBill: 0,
      investmentInSolar: 0,
    },
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    discomData.DISCOMs.forEach((discom) => {
      setDiscoms((prevDiscoms) => [...prevDiscoms, discom?.DISCOM!]);
    });
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('roofCharacteristics.')) {
      const key = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        roofCharacteristics: {
          ...prevData.roofCharacteristics,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith('applianceUsage.')) {
      const key = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        applianceUsage: {
          ...prevData.applianceUsage,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith('timeOfDayPreferences.')) {
      const key = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        timeOfDayPreferences: {
          ...prevData.timeOfDayPreferences,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (name.startsWith('financialData.')) {
      const key = name.split('.')[1];
      setFormData((prevData) => ({
        ...prevData,
        financialData: {
          ...prevData.financialData,
          [key]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const addApplianceDetail = () => {
    setFormData((prevData) => ({
      ...prevData,
      applianceUsage: {
        ...prevData.applianceUsage,
        applianceDetails: [
          ...prevData.applianceUsage.applianceDetails,
          { type: "", quantity: 0, averageUsage: 0, wattCapacity: 0, usagePattern: "", energyEfficiencyRating: "" },
        ],
      },
    }));
  };

  const handleApplianceDetailChange = (index: number, field: string, value: any) => {
    const updatedDetails = formData.applianceUsage.applianceDetails.map((detail, i) =>
      i === index ? { ...detail, [field]: value } : detail
    );
    setFormData((prevData) => ({
      ...prevData,
      applianceUsage: {
        ...prevData.applianceUsage,
        applianceDetails: updatedDetails,
      },
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.primaryGoal) {
          toast.error("Please select your primary energy goal");
          return false;
        }
        if (!formData.energyAwareness) {
          toast.error("Please select your energy awareness level");
          return false;
        }
        break;

      case 2:
        if (formData.roofCharacteristics.hasSolarPanels) {
          if (!formData.roofCharacteristics.roofArea) {
            toast.error("Please enter your roof area");
            return false;
          }
          if (!formData.roofCharacteristics.roofDirection) {
            toast.error("Please select your roof direction");
            return false;
          }
          if (!formData.roofCharacteristics.sunlightHours) {
            toast.error("Please enter daily sunlight exposure");
            return false;
          }
          if (!formData.roofCharacteristics.solarCapacity) {
            toast.error("Please enter your solar capacity");
            return false;
          }
        }
        break;

      case 3:
        if (typeof formData.applianceUsage.hvac === 'undefined') {
          toast.error("Please indicate if you have HVAC systems");
          return false;
        }
        if (!formData.applianceUsage.largeAppliances) {
          toast.error("Please enter the count of large appliances in use");
          return false;
        }
        if (formData.applianceUsage.applianceDetails && formData.applianceUsage.applianceDetails.length > 0) {
          for (let i = 0; i < formData.applianceUsage.applianceDetails.length; i++) {
            const appliance = formData.applianceUsage.applianceDetails[i];
            if (!appliance.type) {
              toast.error(`Please enter the type for appliance ${i + 1}`);
              return false;
            }
            if (!appliance.quantity) {
              toast.error(`Please enter the quantity for appliance ${i + 1}`);
              return false;
            }
            if (!appliance.averageUsage) {
              toast.error(`Please enter the average usage for appliance ${i + 1}`);
              return false;
            }
            if (!appliance.wattCapacity) {
              toast.error(`Please enter the watt capacity for appliance ${i + 1}`);
              return false;
            }
            if (!appliance.usagePattern) {
              toast.error(`Please enter the usage pattern for appliance ${i + 1}`);
              return false;
            }
            if (!appliance.energyEfficiencyRating) {
              toast.error(`Please enter the energy efficiency rating for appliance ${i + 1}`);
              return false;
            }
          }
        }
        if (formData.applianceUsage.batteryStorage && !formData.applianceUsage.storageCapacity) {
          toast.error("Please enter the capacity of battery storage");
          return false;
        }
        break;

      case 4:
        if (!formData.timeOfDayPreferences.preferredTiming) {
          toast.error("Please select your preferred timing for energy usage");
          return false;
        }
        if (typeof formData.timeOfDayPreferences.solarBatteryUsage === 'undefined') {
          toast.error("Please indicate if you rely on solar battery storage during peak tariff periods");
          return false;
        }
        if (!formData.timeOfDayPreferences.flexibility) {
          toast.error("Please select your energy usage flexibility");
          return false;
        }
        break;

      case 5:
        if (!formData.forecastCustomization.expectedUsage) {
          toast.error("Please enter your expected energy usage in kWh");
          return false;
        }
        if (typeof formData.notificationSetup.highTariffAlerts === 'undefined') {
          toast.error("Please indicate if you'd like to receive high tariff alerts");
          return false;
        }
        if (typeof formData.notificationSetup.extremeWeatherAlerts === 'undefined') {
          toast.error("Please indicate if you'd like to receive extreme weather alerts");
          return false;
        }
        break;

      case 6:
        if (!formData.financialData.gridProvider) {
          toast.error("Please select your electricity provider");
          return false;
        }
        if (!formData.financialData.monthlyEnergyBill) {
          toast.error("Please enter your average monthly energy bill");
          return false;
        }
        if (!formData.financialData.investmentInSolar) {
          toast.error("Please enter your total investment in solar technology");
          return false;
        }
        break;

      default:
        return true;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleFormSubmit = async () => {
    if (validateStep()) {
      setShowConfirmDialog(true);
    }
  };

  const confirmAndSubmit = async () => {
    setShowConfirmDialog(false);
    try {
      if (!user) throw new Error("User not authenticated");

      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        createdAt: new Date(),
      });

      toast.success("Setup completed successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("An error occurred while saving your data. Please try again.");
    }
    localStorage.setItem('formData', JSON.stringify(formData));
  };



return (
  <div className="flex items-center justify-center min-h-[92vh] bg-blue-100">
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Welcome to VidyutMitra</CardTitle>
        <CardDescription>{"Let's set up your energy profile"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">User Energy Profile</h2>

              <div>
                <Label htmlFor="primaryGoal">* What is your primary energy goal?</Label>
                <select
                  id="primaryGoal"
                  name="primaryGoal"
                  value={formData.primaryGoal}
                  onChange={handleSelectChange}
                  required
                  className="w-full border border-gray-300 rounded p-2"
                  title="Primary Goal"
                >
                  <option value="">Select your goal</option>
                  <option value="reducingCosts">Reducing costs</option>
                  <option value="sustainability">Sustainability</option>
                  <option value="energyIndependence">Energy independence</option>
                  <option value="smartEnergyScheduling">Smart energy scheduling</option>
                </select>
              </div>

              <div>
                <Label htmlFor="energyAwareness">* What is your level of energy awareness?</Label>
  <select
  id="energyAwareness"
  name="energyAwareness"
  value={formData.energyAwareness}
  onChange={handleSelectChange}
  required
  className="w-full border border-gray-300 rounded p-2"
  title="Energy Awareness Level"
>
  <option value="">Select your awareness level</option>
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="high">High</option>
</select>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Solar Panel Information</h2>

              <div>
                <Label>Do you have solar panels?</Label>
                <RadioGroup
                  name="hasSolarPanels"
                  value={formData.roofCharacteristics.hasSolarPanels.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      roofCharacteristics: {
                        ...prev.roofCharacteristics,
                        hasSolarPanels: value === "true",
                      },
                    }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="solar-yes" />
                    <Label htmlFor="solar-yes" className="text-gray-700">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="solar-no" />
                    <Label htmlFor="solar-no" className="text-gray-700">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.roofCharacteristics.hasSolarPanels && (
                <>
                  <div>
                    <Label htmlFor="roofArea">* Roof area (in square meters)</Label>
                    <Input
                      id="roofArea"
                      name="roofArea"
                      type="number"
                      value={formData.roofCharacteristics.roofArea}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          roofCharacteristics: {
                            ...prev.roofCharacteristics,
                            roofArea: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="roofDirection">* Roof direction</Label>
                    <select
                      id="roofDirection"
                      name="roofDirection"
                      value={formData.roofCharacteristics.roofDirection}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          roofCharacteristics: {
                            ...prev.roofCharacteristics,
                            roofDirection: e.target.value,
                          },
                        }))
                      }
                      required
                      className="w-full border border-gray-300 rounded p-2"
                      title="Roof Direction"
                    >
                      <option value="">Select direction</option>
                      <option value="North">North</option>
                      <option value="South">South</option>
                      <option value="East">East</option>
                      <option value="West">West</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="sunlightHours">* Daily sunlight exposure (in hours)</Label>
                    <Input
                      id="sunlightHours"
                      name="sunlightHours"
                      type="number"
                      value={formData.roofCharacteristics.sunlightHours}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          roofCharacteristics: {
                            ...prev.roofCharacteristics,
                            sunlightHours: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="solarCapacity">* Solar system capacity (in kW)</Label>
                    <Input
                      id="solarCapacity"
                      name="solarCapacity"
                      type="number"
                      value={formData.roofCharacteristics.solarCapacity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          roofCharacteristics: {
                            ...prev.roofCharacteristics,
                            solarCapacity: e.target.value,
                          },
                        }))
                      }
                      required
                    />
                  </div>
                </>
              )}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Appliance and Device Usage</h2>

              {/* HVAC Systems */}
              <div>
                <Label>Do you have HVAC systems?</Label>
                <RadioGroup
                  name="hvac"
                  value={formData.applianceUsage?.hvac?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      applianceUsage: {
                        ...prev.applianceUsage,
                        hvac: value === "true",
                      },
                    }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="hvac-yes" />
                    <Label htmlFor="hvac-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="hvac-no" />
                    <Label htmlFor="hvac-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Large Appliances */}
              <div>
                <Label htmlFor="largeAppliances">* Number of large appliances in use</Label>
                <Input
                  id="largeAppliances"
                  name="largeAppliances"
                  type="number"
                  value={formData.applianceUsage?.largeAppliances || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      applianceUsage: {
                        ...prev.applianceUsage,
                        largeAppliances: Number(e.target.value),
                      },
                    }))
                  }
                  required
                />
              </div>

              {/* Appliance Details */}
              {Array.from({ length: formData.applianceUsage?.largeAppliances || 0 }).map((_, index) => (
                <div key={index} className="border p-4 rounded">
                  <h3 className="text-lg font-semibold">Appliance {index + 1}</h3>

                  <div>
                    <Label htmlFor={`applianceType-${index}`}>* Type of appliance</Label>
                    <Input
                      id={`applianceType-${index}`}
                      name={`applianceType-${index}`}
                      type="text"
                      value={formData.applianceUsage?.applianceDetails?.[index]?.type || ""}
                      onChange={(e) => {
                        const newApplianceDetails = [...(formData.applianceUsage?.applianceDetails || [])];
                        newApplianceDetails[index] = {
                          ...newApplianceDetails[index],
                          type: e.target.value,
                        };
                        setFormData((prev) => ({
                          ...prev,
                          applianceUsage: {
                            ...prev.applianceUsage,
                            applianceDetails: newApplianceDetails,
                          },
                        }));
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`applianceQuantity-${index}`}>* Quantity</Label>
                    <Input
                      id={`applianceQuantity-${index}`}
                      name={`applianceQuantity-${index}`}
                      type="number"
                      value={formData.applianceUsage?.applianceDetails?.[index]?.quantity || ""}
                      onChange={(e) => {
                        const newApplianceDetails = [...(formData.applianceUsage?.applianceDetails || [])];
                        newApplianceDetails[index] = {
                          ...newApplianceDetails[index],
                          quantity: Number(e.target.value),
                        };
                        setFormData((prev) => ({
                          ...prev,
                          applianceUsage: {
                            ...prev.applianceUsage,
                            applianceDetails: newApplianceDetails,
                          },
                        }));
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`applianceAverageUsage-${index}`}>* Average daily usage (kWh)</Label>
                    <Input
                      id={`applianceAverageUsage-${index}`}
                      name={`applianceAverageUsage-${index}`}
                      type="number"
                      value={formData.applianceUsage?.applianceDetails?.[index]?.averageUsage || ""}
                      onChange={(e) => {
                        const newApplianceDetails = [...(formData.applianceUsage?.applianceDetails || [])];
                        newApplianceDetails[index] = {
                          ...newApplianceDetails[index],
                          averageUsage: Number(e.target.value),
                        };
                        setFormData((prev) => ({
                          ...prev,
                          applianceUsage: {
                            ...prev.applianceUsage,
                            applianceDetails: newApplianceDetails,
                          },
                        }));
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`applianceWattCapacity-${index}`}>* Watt capacity</Label>
                    <Input
                      id={`applianceWattCapacity-${index}`}
                      name={`applianceWattCapacity-${index}`}
                      type="number"
                      value={formData.applianceUsage?.applianceDetails?.[index]?.wattCapacity || ""}
                      onChange={(e) => {
                        const newApplianceDetails = [...(formData.applianceUsage?.applianceDetails || [])];
                        newApplianceDetails[index] = {
                          ...newApplianceDetails[index],
                          wattCapacity: Number(e.target.value),
                        };
                        setFormData((prev) => ({
                          ...prev,
                          applianceUsage: {
                            ...prev.applianceUsage,
                            applianceDetails: newApplianceDetails,
                          },
                        }));
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`applianceUsagePattern-${index}`}>* Usage pattern</Label>
                    <Input
                      id={`applianceUsagePattern-${index}`}
                      name={`applianceUsagePattern-${index}`}
                      type="text"
                      value={formData.applianceUsage?.applianceDetails?.[index]?.usagePattern || ""}
                      onChange={(e) => {
                        const newApplianceDetails = [...(formData.applianceUsage?.applianceDetails || [])];
                        newApplianceDetails[index] = {
                          ...newApplianceDetails[index],
                          usagePattern: e.target.value,
                        };
                        setFormData((prev) => ({
                          ...prev,
                          applianceUsage: {
                            ...prev.applianceUsage,
                            applianceDetails: newApplianceDetails,
                          },
                        }));
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`applianceEnergyEfficiencyRating-${index}`}>* Energy efficiency rating</Label>
                    <Input
                      id={`applianceEnergyEfficiencyRating-${index}`}
                      name={`applianceEnergyEfficiencyRating-${index}`}
                      type="text"
                      value={formData.applianceUsage?.applianceDetails?.[index]?.energyEfficiencyRating || ""}
                      onChange={(e) => {
                        const newApplianceDetails = [...(formData.applianceUsage?.applianceDetails || [])];
                        newApplianceDetails[index] = {
                          ...newApplianceDetails[index],
                          energyEfficiencyRating: e.target.value,
                        };
                        setFormData((prev) => ({
                          ...prev,
                          applianceUsage: {
                            ...prev.applianceUsage,
                            applianceDetails: newApplianceDetails,
                          },
                        }));
                      }}
                      required
                    />
                  </div>
                </div>
              ))}

              {/* Battery Storage */}
              <div>
                <Label>Do you use battery storage for solar energy?</Label>
                <RadioGroup
                  name="batteryStorage"
                  value={formData.applianceUsage?.batteryStorage?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      applianceUsage: {
                        ...prev.applianceUsage,
                        batteryStorage: value === "true",
                      },
                    }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="battery-yes" />
                    <Label htmlFor="battery-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="battery-no" />
                    <Label htmlFor="battery-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.applianceUsage?.batteryStorage && (
                <div>
                  <Label htmlFor="storageCapacity">* Battery storage capacity (in kWh)</Label>
                  <Input
                    id="storageCapacity"
                    name="storageCapacity"
                    type="number"
                    value={formData.applianceUsage?.storageCapacity || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        applianceUsage: {
                          ...prev.applianceUsage,
                          storageCapacity: Number(e.target.value),
                        },
                      }))
                    }
                    required
                  />
                </div>
              )}

              {/* Smart Devices */}
              <div>
                <Label htmlFor="smartDevices">List of smart home devices integrated (comma-separated)</Label>
                <Input
                  id="smartDevices"
                  name="smartDevices"
                  type="text"
                  value={formData.smartDevices?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      smartDevices: e.target.value.split(",").map((device) => device.trim()),
                    }))
                  }
                />
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Time-of-Use Preferences</h2>

              {/* Energy Usage Timing */}
              <div>
                <Label htmlFor="preferredTiming">* Preferred timing for energy usage</Label>
                <select
                  id="preferredTiming"
                  name="preferredTiming"
                  value={formData.timeOfDayPreferences.preferredTiming}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeOfDayPreferences: {
                        ...prev.timeOfDayPreferences,
                        preferredTiming: e.target.value,
                      },
                    }))
                  }
                  required
                  className="border rounded-md p-2 w-full"
                  title="Preferred Timing for Energy Usage"
                >
                  <option value="">Select an option</option>
                  <option value="A Zone">A Zone: 10 PM to 6 AM</option>
                  <option value="B Zone">B Zone: 6 AM to 9 AM and 12 PM to 6 PM</option>
                  <option value="C Zone">C Zone: 9 AM to 12 PM</option>
                  <option value="D Zone">D Zone: 6 PM to 10 PM</option>
                </select>
              </div>

              {/* Reliance on Solar Battery Storage During Peak Hours */}
              <div>
                <Label>Do you rely on solar battery storage during peak tariff periods?</Label>
                <RadioGroup
                  name="solarBatteryUsage"
                  value={formData.timeOfDayPreferences.solarBatteryUsage.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeOfDayPreferences: {
                        ...prev.timeOfDayPreferences,
                        solarBatteryUsage: value === "true",
                      },
                    }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="battery-usage-yes" />
                    <Label htmlFor="battery-usage-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="battery-usage-no" />
                    <Label htmlFor="battery-usage-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Energy Usage Flexibility */}
              <div>
  <Label htmlFor="flexibility">* Flexibility in adjusting energy usage timing</Label>
  <select
    id="flexibility"
    name="flexibility"
    value={formData.timeOfDayPreferences.flexibility}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        timeOfDayPreferences: {
          ...prev.timeOfDayPreferences,
          flexibility: e.target.value,
        },
      }))
    }
    required
    className="border rounded-md p-2 w-full"
    title="Flexibility in adjusting energy usage timing"
  >
    <option value="">Select an option</option>
    <option value="Flexible">Flexible: Willing to shift energy usage to any low-tariff period</option>
    <option value="Somewhat Flexible">Somewhat Flexible: Can adjust within certain time windows</option>
    <option value="Not Flexible">Not Flexible: Fixed schedule, cannot adjust energy usage</option>
  </select>
</div>
            </div>
          )}

      



{step === 5 && (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Forecasting and Customization</h2>

    {/* Expected Energy Usage */}
    <div>
      <Label htmlFor="expectedUsage">
        * Expected energy usage (in kWh)
      </Label>
      <Input
        id="expectedUsage"
        name="expectedUsage"
        type="number"
        value={formData.forecastCustomization.expectedUsage}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            forecastCustomization: {
              ...prev.forecastCustomization,
              expectedUsage: parseFloat(e.target.value),
            },
          }))
        }
        required
      />
    </div>

    <h2 className="text-xl font-semibold">Notification Preferences</h2>

    {/* High Tariff Alerts */}
    <div>
      <Label>Would you like to receive high tariff alerts?</Label>
      <RadioGroup
        name="highTariffAlerts"
        value={formData.notificationSetup.highTariffAlerts.toString()}
        onValueChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            notificationSetup: {
              ...prev.notificationSetup,
              highTariffAlerts: value === "true",
            },
          }))
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="high-tariff-alerts-yes" />
          <Label htmlFor="high-tariff-alerts-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="high-tariff-alerts-no" />
          <Label htmlFor="high-tariff-alerts-no">No</Label>
        </div>
      </RadioGroup>
    </div>

    {/* Extreme Weather Alerts */}
    <div>
      <Label>Would you like to receive extreme weather alerts?</Label>
      <RadioGroup
        name="extremeWeatherAlerts"
        value={formData.notificationSetup.extremeWeatherAlerts.toString()}
        onValueChange={(value) =>
          setFormData((prev) => ({
            ...prev,
            notificationSetup: {
              ...prev.notificationSetup,
              extremeWeatherAlerts: value === "true",
            },
          }))
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="extreme-weather-alerts-yes" />
          <Label htmlFor="extreme-weather-alerts-yes">Yes</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="extreme-weather-alerts-no" />
          <Label htmlFor="extreme-weather-alerts-no">No</Label>
        </div>
      </RadioGroup>
    </div>
  </div>
)}
{step === 6 && (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold">Cost-Benefit Analysis</h2>

    {/* Grid Provider */}
    <div>
      <Label htmlFor="electricityProvider">
        * Current electricity provider
      </Label>
      <AutoCompleteInput
        data={discoms}
        className="w-full"
        value={formData.financialData.gridProvider}
        setValue={(value) =>
          setFormData((prev) => ({
            ...prev,
            financialData: {
              ...prev.financialData,
              gridProvider: value,
            },
          }))
        }
      />
    </div>

    {/* Average Monthly Energy Bill */}
    <div>
      <Label htmlFor="monthlyEnergyBill">
        * Average monthly energy bill (in INR)
      </Label>
      <Input
        id="monthlyEnergyBill"
        name="monthlyEnergyBill"
        type="number"
        value={formData.financialData.monthlyEnergyBill}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            financialData: {
              ...prev.financialData,
              monthlyEnergyBill: parseFloat(e.target.value),
            },
          }))
        }
        required
      />
    </div>

    {/* Investment in Solar */}
    <div>
      <Label htmlFor="investmentInSolar">
        * Total investment in solar panels (in INR)
      </Label>
      <Input
        id="investmentInSolar"
        name="investmentInSolar"
        type="number"
        value={formData.financialData.investmentInSolar}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            financialData: {
              ...prev.financialData,
              investmentInSolar: parseFloat(e.target.value),
            },
          }))
        }
        required
      />
    </div>
  </div>
)}
<div className="flex justify-between">
  <Button type="button" disabled={step === 1} onClick={() => setStep(step - 1)}>
    Back
  </Button>
  <Button type="button" onClick={step === 6 ? handleFormSubmit : nextStep}>
    {step === 6 ? "Submit" : "Next"}
  </Button>
</div>
</form>
</CardContent>
<Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Submission</DialogTitle>
      <DialogDescription>
        Are you sure you want to submit your information?
      </DialogDescription>
    </DialogHeader>
    
    {/* Ensure your DialogContent has enough space for the buttons */}
    <DialogFooter style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
      <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
        Cancel
      </Button>
      <Button onClick={confirmAndSubmit}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

</Card>
</div>
  );
}

















 