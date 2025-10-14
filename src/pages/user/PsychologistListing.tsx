import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import Pagination from "../../components/Pagination";
import type paginationData from "../../types/pagination.types";
import { fetchPsychologistsByUser } from "../../services/userService";
import type { ListPsychSummary } from "../../types/api/user.types";

const BookSession: React.FC = () => {
  const navigate = useNavigate();

  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [sortOption, setSortOption] = useState("a-z");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [psychologists, setPsychologists] = useState<ListPsychSummary[]>([]);
  const [search,setSearch]=useState<string>("")
  const [paginationData, setPaginationData] = useState<paginationData>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 10, // default page size
  });

  const pageSize = 10; // or any default you want

  // Fetch function
  const fetchPsychologists = async () => {
    console.log("fetching works function");
    const skip = (currentPage - 1) * pageSize;

    const params = new URLSearchParams();
    if (selectedSpecialization)
      params.append("specialization", selectedSpecialization);
    if (selectedGender) params.append("gender", selectedGender);
    if (searchDate) params.append("date", searchDate);
    if (sortOption) params.append("sort", sortOption);
    if(search && search !==""){
      params.append("search",search)
    }
    params.append("skip", skip.toString());
    params.append("limit", pageSize.toString());
    console.log(selectedGender, selectedSpecialization);
    try {
      const res = await fetchPsychologistsByUser(params.toString());
      if (res.data) {
        console.log(res.data);
        setPsychologists(res.data.psychologists);
        setPaginationData(res.data.paginationData);
      }
    } catch (err) {
      setPsychologists([]);
      console.error("Error fetching psychologists:", err);
    }
  };

  // Fetch on page load and whenever filters/sort/currentPage changes
  useEffect(() => {
    fetchPsychologists();
  }, [
    currentPage,
    selectedSpecialization,
    selectedGender,
    searchDate,
    sortOption,
    search
  ]);

  const handlePsychologistClick = async (psychologistId: string) => {
    navigate(`/user/psychologist-details?psychId=${psychologistId}`);
  };

  // Specializations, genders, languages can stay the same
  const specializations = [
    "Anxiety & Depression",
    "Relationship Counseling",
    "Trauma Therapy",
    "Cognitive Behavioral Therapy",
    "Family Therapy",
    "PTSD Treatment",
    "Addiction Counseling",
    "Child Psychology",
  ];
  const genders = ["male", "female", "other"];

  return (
    <Card>
      <div className="min-h-screen bg-gradient-background py-6">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Book a Session
            </h1>
            <p className="text-muted-foreground">
              Find and book with qualified therapists and psychologists
            </p>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6 shadow-glass bg-gradient-glass">
          <div className="flex items-center space-x-2 my-2">
            <input
              type="text"
              placeholder="Search by name or specializations or languages"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="border w-[50vw] border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              >
                <option value="">All Specializations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>

              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              >
                <option value="">All Genders</option>
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              />

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground"
              >
                <option value="a-z">Sort: A-Z</option>
                <option value="z-a">Sort: Z-A</option>
                <option value="rating">Sort: Rating</option>
                <option value="price">Sort: Price</option>
              </select>
            </div>
          </Card>

          {/* Psychologists List */}
          <div className="space-y-4">
            {psychologists.map((psych) => {
              const specs = psych.specializations
                ? psych.specializations.split(",")
                : [];

              return (
                <Card
                  key={psych.psychId}
                  className="p-3 shadow-glass bg-gradient-glass hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    {psych.profilePicture ? (
                      <img
                        src={psych.profilePicture}
                        alt={psych.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                        {psych.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        {psych.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          ⭐ {psych.rating ?? "N/A"}
                        </span>
                        <span className="text-xs font-semibold text-success">
                          ${psych.hourlyFees ?? "--"}/hr
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {specs.slice(0, 2).map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      {psych.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {psych.bio}
                        </p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePsychologistClick(psych.psychId)}
                        className="text-sm px-3 py-1"
                      >
                        Book session
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {psychologists.length === 0 && (
            <Card className="p-8 text-center shadow-glass bg-gradient-glass">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Psychologists Found
              </h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting your search criteria or browse all available
                psychologists
              </p>
            </Card>
          )}

          {/* Pagination */}
          <Pagination
            paginationData={paginationData}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </Card>
  );
};

export default BookSession;
